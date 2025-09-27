module freelance::platform {
	use sui::object::{Self, UID};
	use sui::tx_context::{Self, TxContext};
	use sui::balance::{Self, Balance};
	use sui::coin::{Self, Coin};
	use sui::sui::SUI;
	use sui::transfer;
	use sui::signer;
	use sui::vector;
	use sui::option::{Self, Option};
	use sui::table::{Self, Table};
	use sui::clock::{Self, Clock};
	use sui::event;
	use std::string::{Self, String};
	use std::debug;

	// ===== ERRORS =====
	const ENotAuthorized: u64 = 0;
	const EJobNotFound: u64 = 1;
	const EJobAlreadyTaken: u64 = 2;
	const EJobNotCompleted: u64 = 3;
	const EJobAlreadyCompleted: u64 = 4;
	const EJobNotContested: u64 = 5;
	const EJobAlreadyContested: u64 = 6;
	const EInsufficientCred: u64 = 7;
	const EInsufficientPayment: u64 = 8;
	const EInvalidJobIndex: u64 = 9;
	const ECannotAcceptOwnJob: u64 = 10;
	const EJobNotAccepted: u64 = 11;
	const EInsufficientCautionDeposit: u64 = 12;

	// ===== STRUCTS =====
	
	/// Cred score object (per account)
	struct Cred has key {
		id: UID,
		score: u64,
		total_jobs: u64,
		successful_jobs: u64,
	}

	/// A single job offer
	struct Job has key, store {
		id: UID,
		employer: address,
		freelancer: Option<address>,
		description: String,
		payment: Balance<SUI>,
		fee: Balance<SUI>, // Platform fee (5%)
		required_cred: u64,
		caution_deposit: Option<Balance<SUI>>,
		completed: bool,
		contested: bool,
		created_at: u64,
		completed_at: Option<u64>,
	}

	/// The registry that stores all job offers
	struct JobRegistry has key {
		id: UID,
		jobs: Table<u64, Job>,
		next_job_id: u64,
		platform_fee_percentage: u64, // 5% = 500 (basis points)
	}

	/// Platform treasury for collecting fees
	struct PlatformTreasury has key {
		id: UID,
		balance: Balance<SUI>,
	}

	// ===== EVENTS =====
	
	struct JobCreated has copy, drop {
		job_id: u64,
		employer: address,
		description: String,
		payment: u64,
		required_cred: u64,
	}

	struct JobAccepted has copy, drop {
		job_id: u64,
		freelancer: address,
		caution_deposit: Option<u64>,
	}

	struct JobCompleted has copy, drop {
		job_id: u64,
		employer: address,
		freelancer: address,
		payment: u64,
	}

	struct JobContested has copy, drop {
		job_id: u64,
		freelancer: address,
		reason: String,
	}

	struct JobResolved has copy, drop {
		job_id: u64,
		resolution: bool, // true = completed, false = failed
		employer_cred_change: i64,
		freelancer_cred_change: i64,
	}

	struct CredUpdated has copy, drop {
		user: address,
		old_score: u64,
		new_score: u64,
		change: i64,
	}

	// ===== INITIALIZATION =====

	/// Initialize the platform (admin only, once)
	public entry fun init_platform(admin: &signer, ctx: &mut TxContext) {
		let registry = JobRegistry {
			id: object::new(ctx),
			jobs: table::new(ctx),
			next_job_id: 0,
			platform_fee_percentage: 500, // 5%
		};

		let treasury = PlatformTreasury {
			id: object::new(ctx),
			balance: balance::zero<SUI>(),
		};

		transfer::share_object(registry);
		transfer::share_object(treasury);
	}

	/// Initialize a new user's Cred
	public entry fun init_user(user: &signer, ctx: &mut TxContext) {
		let cred = Cred {
			id: object::new(ctx),
			score: 0,
			total_jobs: 0,
			successful_jobs: 0,
		};
		move_to(user, cred);
	}

	// ===== JOB MANAGEMENT =====

	/// Create a new job offer
	public entry fun create_job(
		employer: &signer,
		registry: &mut JobRegistry,
		treasury: &mut PlatformTreasury,
		description: String,
		payment: Coin<SUI>,
		required_cred: u64,
		clock: &Clock,
		ctx: &mut TxContext,
	) {
		let employer_addr = signer::address_of(employer);
		let payment_amount = coin::value(&payment);
		
		// Calculate platform fee
		let fee_amount = (payment_amount * registry.platform_fee_percentage) / 10000;
		let net_payment = payment_amount - fee_amount;

		// Transfer fee to treasury
		let fee_coin = coin::split(&mut payment, fee_amount, ctx);
		balance::join(&mut treasury.balance, coin::into_balance(fee_coin));

		let job = Job {
			id: object::new(ctx),
			employer: employer_addr,
			freelancer: option::none(),
			description,
			payment: coin::into_balance(payment),
			fee: balance::zero<SUI>(),
			required_cred,
			caution_deposit: option::none(),
			completed: false,
			contested: false,
			created_at: clock::timestamp_ms(clock),
			completed_at: option::none(),
		};

		let job_id = registry.next_job_id;
		table::add(&mut registry.jobs, job_id, job);
		registry.next_job_id = registry.next_job_id + 1;

		event::emit(JobCreated {
			job_id,
			employer: employer_addr,
			description: string::bytes(&description),
			payment: net_payment,
			required_cred,
		});
	}

	/// Accept a job (freelancer applies)
	public entry fun accept_job(
		freelancer: &signer,
		registry: &mut JobRegistry,
		job_id: u64,
		caution_deposit: Option<Coin<SUI>>,
		ctx: &mut TxContext,
	) acquires Cred {
		let freelancer_addr = signer::address_of(freelancer);
		
		// Check if job exists
		assert!(table::contains(&registry.jobs, job_id), EJobNotFound);
		let job = table::borrow_mut(&mut registry.jobs, job_id);

		// Prevent self-assignment
		assert!(job.employer != freelancer_addr, ECannotAcceptOwnJob);
		
		// Check if job is already taken
		assert!(option::is_none(&job.freelancer), EJobAlreadyTaken);

		// Check freelancer's cred
		let cred = borrow_global<Cred>(freelancer_addr);
		if (cred.score < job.required_cred) {
			// Require caution deposit for low-cred freelancers
			assert!(option::is_some(&caution_deposit), EInsufficientCautionDeposit);
			let deposit_coin = option::extract(&mut caution_deposit);
			let deposit_amount = coin::value(&deposit_coin);
			
			// Store caution deposit in job
			job.caution_deposit = option::some(coin::into_balance(deposit_coin));
		};

		// Assign freelancer
		job.freelancer = option::some(freelancer_addr);

		event::emit(JobAccepted {
			job_id,
			freelancer: freelancer_addr,
			caution_deposit: if (option::is_some(&job.caution_deposit)) {
				option::some(balance::value(&option::borrow(&job.caution_deposit)))
			} else {
				option::none()
			},
		});
	}

	/// Mark job as completed (employer only)
	public entry fun complete_job(
		employer: &signer,
		registry: &mut JobRegistry,
		job_id: u64,
		clock: &Clock,
	) {
		let employer_addr = signer::address_of(employer);
		
		assert!(table::contains(&registry.jobs, job_id), EJobNotFound);
		let job = table::borrow_mut(&mut registry.jobs, job_id);

		assert!(job.employer == employer_addr, ENotAuthorized);
		assert!(option::is_some(&job.freelancer), EJobNotAccepted);
		assert!(!job.completed, EJobAlreadyCompleted);

		job.completed = true;
		job.completed_at = option::some(clock::timestamp_ms(clock));

		let freelancer_addr = option::borrow(&job.freelancer);
		event::emit(JobCompleted {
			job_id,
			employer: employer_addr,
			freelancer: *freelancer_addr,
			payment: balance::value(&job.payment),
		});
	}

	/// Contest a job (freelancer initiates dispute)
	public entry fun contest_job(
		freelancer: &signer,
		registry: &mut JobRegistry,
		job_id: u64,
		reason: String,
	) {
		let freelancer_addr = signer::address_of(freelancer);
		
		assert!(table::contains(&registry.jobs, job_id), EJobNotFound);
		let job = table::borrow_mut(&mut registry.jobs, job_id);

		assert!(option::is_some(&job.freelancer), EJobNotAccepted);
		let assigned_freelancer = option::borrow(&job.freelancer);
		assert!(*assigned_freelancer == freelancer_addr, ENotAuthorized);
		assert!(!job.completed, EJobAlreadyCompleted);
		assert!(!job.contested, EJobAlreadyContested);

		job.contested = true;

		event::emit(JobContested {
			job_id,
			freelancer: freelancer_addr,
			reason: string::bytes(&reason),
		});
	}

	/// Resolve contested job (admin only)
	public entry fun resolve_job(
		admin: &signer,
		registry: &mut JobRegistry,
		treasury: &mut PlatformTreasury,
		job_id: u64,
		resolution: bool, // true = completed, false = failed
		ctx: &mut TxContext,
	) acquires Cred {
		let admin_addr = signer::address_of(admin);
		// In production, you'd check if admin_addr is authorized
		
		assert!(table::contains(&registry.jobs, job_id), EJobNotFound);
		let job = table::borrow_mut(&mut registry.jobs, job_id);
		
		assert!(job.contested, EJobNotContested);
		assert!(option::is_some(&job.freelancer), EJobNotAccepted);

		let employer_addr = job.employer;
		let freelancer_addr = option::borrow(&job.freelancer);

		// Update job status
		job.completed = resolution;
		job.contested = false;

		// Calculate cred changes
		let payment_amount = balance::value(&job.payment);
		let freelancer_cred_change = if (resolution) {
			calculate_cred_gain(payment_amount)
		} else {
			-(calculate_cred_gain(payment_amount) as i64)
		};

		let employer_cred_change = if (resolution) {
			calculate_cred_gain(payment_amount) / 2
		} else {
			-(calculate_cred_gain(payment_amount) / 2)
		};

		// Update freelancer cred
		let fcred = borrow_global_mut<Cred>(*freelancer_addr);
		let old_fscore = fcred.score;
		fcred.total_jobs = fcred.total_jobs + 1;
		if (resolution) {
			fcred.successful_jobs = fcred.successful_jobs + 1;
			fcred.score = fcred.score + (freelancer_cred_change as u64);
		} else {
			fcred.score = if (fcred.score >= (freelancer_cred_change as u64)) {
				fcred.score - (freelancer_cred_change as u64)
			} else {
				0
			};
		};

		// Update employer cred
		let ecred = borrow_global_mut<Cred>(employer_addr);
		let old_escore = ecred.score;
		ecred.total_jobs = ecred.total_jobs + 1;
		if (resolution) {
			ecred.successful_jobs = ecred.successful_jobs + 1;
			ecred.score = ecred.score + (employer_cred_change as u64);
		} else {
			ecred.score = if (ecred.score >= (employer_cred_change as u64)) {
				ecred.score - (employer_cred_change as u64)
			} else {
				0
			};
		};

		// Handle payments and deposits
		if (resolution) {
			// Job completed successfully - transfer payment to freelancer
			let payment_coin = coin::from_balance(job.payment, ctx);
			transfer::public_transfer(payment_coin, *freelancer_addr);

			// Refund caution deposit if any
			if (option::is_some(&job.caution_deposit)) {
				let deposit_coin = coin::from_balance(option::extract(&mut job.caution_deposit), ctx);
				transfer::public_transfer(deposit_coin, *freelancer_addr);
			};
		} else {
			// Job failed - forfeit caution deposit, refund payment to employer
			let payment_coin = coin::from_balance(job.payment, ctx);
			transfer::public_transfer(payment_coin, employer_addr);

			// Caution deposit goes to platform treasury
			if (option::is_some(&job.caution_deposit)) {
				let deposit_balance = option::extract(&mut job.caution_deposit);
				balance::join(&mut treasury.balance, deposit_balance);
			};
		};

		event::emit(JobResolved {
			job_id,
			resolution,
			employer_cred_change,
			freelancer_cred_change,
		});

		event::emit(CredUpdated {
			user: employer_addr,
			old_score: old_escore,
			new_score: ecred.score,
			change: employer_cred_change,
		});

		event::emit(CredUpdated {
			user: *freelancer_addr,
			old_score: old_fscore,
			new_score: fcred.score,
			change: freelancer_cred_change,
		});
	}

	// ===== HELPER FUNCTIONS =====

	/// Calculate cred gain based on payment amount
	fun calculate_cred_gain(payment: u64): u64 {
		if (payment <= 100_000_000) { // 0.1 SUI
			1
		} else if (payment <= 1_000_000_000) { // 1 SUI
			3
		} else if (payment <= 10_000_000_000) { // 10 SUI
			5
		} else {
			10
		}
	}

	// ===== VIEW FUNCTIONS =====

	/// Get job by ID
	public fun get_job(registry: &JobRegistry, job_id: u64): &Job {
		assert!(table::contains(&registry.jobs, job_id), EJobNotFound);
		table::borrow(&registry.jobs, job_id)
	}

	/// Get user's cred score
	public fun get_user_cred(user_addr: address): &Cred acquires Cred {
		borrow_global<Cred>(user_addr)
	}

	/// Get all job IDs
	public fun get_job_ids(registry: &JobRegistry): vector<u64> {
		table::keys(&registry.jobs)
	}

	/// Get platform treasury balance
	public fun get_treasury_balance(treasury: &PlatformTreasury): u64 {
		balance::value(&treasury.balance)
	}

	// ===== ADMIN FUNCTIONS =====

	/// Withdraw platform fees (admin only)
	public entry fun withdraw_fees(
		admin: &signer,
		treasury: &mut PlatformTreasury,
		amount: u64,
		ctx: &mut TxContext,
	) {
		let admin_addr = signer::address_of(admin);
		// In production, verify admin authorization
		
		let treasury_balance = balance::value(&treasury.balance);
		assert!(treasury_balance >= amount, EInsufficientPayment);
		
		let fee_coin = coin::from_balance(balance::split(&mut treasury.balance, amount), ctx);
		transfer::public_transfer(fee_coin, admin_addr);
	}

	/// Update platform fee percentage (admin only)
	public entry fun update_fee_percentage(
		admin: &signer,
		registry: &mut JobRegistry,
		new_percentage: u64,
	) {
		let admin_addr = signer::address_of(admin);
		// In production, verify admin authorization
		
		assert!(new_percentage <= 1000, EInvalidJobIndex); // Max 10%
		registry.platform_fee_percentage = new_percentage;
	}
}
