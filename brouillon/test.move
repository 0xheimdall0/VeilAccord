module freelance::cred {

    /// Decide cred gain/loss for freelancers
    public fun adjust_freelancer(completed: bool, payment: u64): i64 {
        let importance = bracket(payment);
        if (completed) { importance } else { -importance }
    }

    /// Decide cred gain/loss for employers
    public fun adjust_employer(completed: bool, payment: u64): i64 {
        let importance = bracket(payment);
        // employers gain/lose less per job
        if (completed) { importance / 2 } else { -(importance / 2) }
    }

    /// Map payment value to importance bracket
    fun bracket(payment: u64): i64 {
        if (payment <= 100) {
            1
        } else if (payment <= 1000) {
            3
        } else {
            5
        }
    }
}

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
		id: object::new(ctx), // A STOCKER DANS UNE DB POUR POUVOIR PASSER LA REGISTERY EN ARG DANS LA FUN ADD_JOB
		jobs: vector::empty<Job>(),
	};
	// Partage la registry pour qu’elle devienne publique
	transfer::share_object(registry);
}

    /// Add a new job offer into the registry
    public entry fun add_job(
    employer: &signer,
    registry: &mut JobRegistry,   // 🔥 On passe la registry partagée en argument
    description: vector<u8>,
    payment: u64,
    required_cred: u64,
    ctx: &mut TxContext
) {
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

    /// Resolve job → update cred for employer + freelancer
    public entry fun resolve_job(job_index: u64) acquires JobRegistry, Cred {
        let registry = borrow_global_mut<JobRegistry>(@0xADMIN);
        let job_ref = vector::borrow(&registry.jobs, job_index);

        let employer_addr = job_ref.employer;
        let freelancer_addr = option::extract(&mut option::clone(&job_ref.freelancer));

        // update freelancer cred
        let fcred = borrow_global_mut<Cred>(freelancer_addr);
        let delta_f = cred::adjust_freelancer(job_ref.completed, job_ref.payment);
        fcred.score = fcred.score + delta_f;

        // update employer cred
        let ecred = borrow_global_mut<Cred>(employer_addr);
        let delta_e = cred::adjust_employer(job_ref.completed, job_ref.payment);
        ecred.score = ecred.score + delta_e;
    }
	    /// Read job list (frontend can query)
    public fun list_jobs(): &vector<Job> acquires JobRegistry {
        &borrow_global<JobRegistry>(@0xADMIN).jobs
    }
}
