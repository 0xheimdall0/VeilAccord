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

module freelance::jobs {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::balance;
    use sui::coin::{Self, Coin};
    use freelance::cred;

    /// Cred score object (per account)
    struct Cred has key {
        id: UID,
        score: i64,
    }

    /// A single job offer
    struct Job has store {
        employer: address,
        freelancer: option::Option<address>,
        description: vector<u8>,
        payment: u64,
        required_cred: u64,
        completed: bool,
    }

    /// Registry of all jobs (global, under admin’s account)
    struct JobRegistry has key {
        id: UID,
        jobs: vector<Job>,
    }

    /// Initialize a new user’s Cred
    public entry fun init_user(user: &signer, ctx: &mut TxContext) {
        move_to(user, Cred { id: object::new(ctx), score: 0 });
    }

    /// Initialize the job registry (admin only, once)
    public entry fun init_registry(admin: &signer, ctx: &mut TxContext) {
        let registry = JobRegistry {
            id: object::new(ctx),
            jobs: vector::empty<Job>(),
        };
        move_to(admin, registry);
    }

    /// Post a job offer
    public entry fun post_job(
        employer: &signer,
        description: vector<u8>,
        payment: u64,
        required_cred: u64,
    ) acquires JobRegistry {
        let registry = borrow_global_mut<JobRegistry>(@0xADMIN); // replace with actual admin addr

        let job = Job {
            employer: signer::address_of(employer),
            freelancer: option::none<address>(),
            description,
            payment,
            required_cred,
            completed: false,
        };
        vector::push_back(&mut registry.jobs, job);
    }

    /// Accept a job (freelancer applies)
    public entry fun accept_job(
        freelancer: &signer,
        job_index: u64,
    ) acquires JobRegistry {
        let registry = borrow_global_mut<JobRegistry>(@0xADMIN);
        let job_ref = vector::borrow_mut(&mut registry.jobs, job_index);

        // prevent self-assignment
        assert!(job_ref.employer != signer::address_of(freelancer), 1);

        // assign freelancer if slot empty
        if (option::is_none(&job_ref.freelancer)) {
            job_ref.freelancer = option::some(signer::address_of(freelancer));
        } else {
            abort 2; // already taken
        }
    }

    /// Employer marks job complete
    public entry fun complete_job(employer: &signer, job_index: u64) acquires JobRegistry {
        let registry = borrow_global_mut<JobRegistry>(@0xADMIN);
        let job_ref = vector::borrow_mut(&mut registry.jobs, job_index);

        assert!(job_ref.employer == signer::address_of(employer), 3);
        job_ref.completed = true;
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
