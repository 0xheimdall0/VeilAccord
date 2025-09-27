module freelance::platform {
	use sui::object::{Self, UID};
	use sui::tx_context::{Self, TxContext};
	use sui::balance;
	use sui::coin::{Self, Coin};

	// --- Cred System ---
	struct Cred has key {
		id: UID,
		score: u64,  // reputation score
	}

	   /// A single job offer
	struct Job has key, store {
		id: UID,
		employer: address,
		description: vector<u8>,
		payment: Balance<SUI>,
		fee: Balance<SUI>,
		required_cred: u64,
		freelancer: option::Option<address>,
		caution: option:Balance<SUI>,
		completed: bool,
		contested: bool,
	}

	/// The registry that stores all job offers
	struct JobRegistry has key {
		id: UID,
		jobs: vector<Job>,
	}

	/// Initialize the registry (once)
	public entry fun init_registry(ctx: &mut TxContext) {
	let registry = JobRegistry {
		id: object::new(ctx),
		jobs: vector::empty<Job>(),
	};
	// Partage la registry pour qu’elle devienne publique
	transfer::share_object(registry);
}

	/// Add a new job offer into the registry
	public entry fun add_job(
		employer: &signer,
		description: vector<u8>,
		payment: u64,
		required_cred: u64,
		ctx: &mut TxContext
	) acquires JobRegistry {
		let registry = borrow_global_mut<JobRegistry>(@0x06430832ca656702c71c25f4b3e0edf6d94b3855d7fd636c013f90af87dddac3); //L'ADRESSE ADMIN
		let job = Job {
			id: object::new(ctx),
			employer: signer::address_of(employer),
			freelancer: option::none<address>(),
			description,
			payment,
			required_cred,
			caution: 0,
			completed: false,
			contested: false,
		};
		vector::push_back(&mut registry.jobs, job);
	}

	/// Get the full job list (for frontend queries)
	public fun list_jobs(registry_id: address): &vector<Job> acquires JobRegistry {
		&borrow_global<JobRegistry>(registry_id).jobs
	}

	// --- Initialize Cred for a new user ---
	public entry fun init_user(user: &signer, ctx: &mut TxContext) {
		move_to(user, Cred { id: object::new(ctx), score: 0 });
	} // TODO : Algo pour cred


	// --- Accept a Job ---
	public entry fun accept_job(
		freelancer: &signer,
		job_id: address,
		caution_deposit: Coin<SUI>,  // optional
	) acquires Job, Cred {
		let job = borrow_global_mut<Job>(job_id);
		let cred = borrow_global<Cred>(signer::address_of(freelancer));

		// Check cred
		if (cred.score < job.required_cred) { // TODO : Formule par palier qui le fait mieux
			// requires caution deposit
			job.caution = coin::value(&caution_deposit);
			// TODO: hold deposit inside contract
		};

		job.freelancer = option::some(signer::address_of(freelancer));
	}

	// --- Mark Job Complete ---
	public entry fun complete_job(employer: &signer, job_id: address) acquires Job {
		let job = borrow_global_mut<Job>(job_id);
		assert!(job.employer == signer::address_of(employer), 1);
		job.completed = true;
	}

	// --- Contest Job (Freelancer initiates dispute) ---
	public entry fun contest(freelancer: &signer, job_id: address) acquires Job {
		let job = borrow_global_mut<Job>(job_id);
		assert!(option::extract(&mut job.freelancer) == signer::address_of(freelancer), 2);
		job.contested = true;
	}

	// --- Support Intervention (Admin resolves) ---
	public entry fun resolve(admin: &signer, job_id: address, outcome: bool) acquires Job, Cred {
		let job = borrow_global_mut<Job>(job_id);
		// Only special admin account allowed (hardcoded or configurable)
		assert!(signer::address_of(admin) == @0x06430832ca656702c71c25f4b3e0edf6d94b3855d7fd636c013f90af87dddac3, 3); // L'ADRESSE ADMIN

		if (outcome) {
			// TODO reward freelancer + update cred according to the algo by both employer and freelancer
		} else {
			// TODO refund employer or keep caution and/or lessen the cred by freelancer and/or employer
		};
	}
}
