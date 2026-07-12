#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol, Vec, String, IntoVal};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TaskMetadata {
    pub description: String,
    pub tags: Vec<Symbol>,
    pub progress: u32,
    pub owner: Address,
    pub status: Symbol,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    RegistryAddress,
    Task(u32), // task_id -> TaskMetadata
}

#[contract]
pub struct TaskContract;

#[contractimpl]
impl TaskContract {
    pub fn __constructor(env: Env, registry: Address) {
        env.storage().instance().set(&DataKey::RegistryAddress, &registry);
    }

    pub fn create_task(env: Env, id: u32, description: String, tags: Vec<Symbol>, owner: Address) {
        owner.require_auth();

        let task = TaskMetadata {
            description,
            tags,
            progress: 0,
            owner: owner.clone(),
            status: Symbol::new(&env, "Processing"),
        };

        env.storage().persistent().set(&DataKey::Task(id), &task);
        env.storage().persistent().extend_ttl(&DataKey::Task(id), 17280, 518400);

        // Emit event: ["task_created", id] -> owner
        env.events().publish(
            (Symbol::new(&env, "task_created"), id),
            owner
        );
    }

    pub fn update_progress(env: Env, id: u32, progress: u32) {
        let mut task: TaskMetadata = env
            .storage()
            .persistent()
            .get(&DataKey::Task(id))
            .expect("Task not found");
        task.owner.require_auth();

        assert!(progress <= 100, "Progress cannot exceed 100%");
        task.progress = progress;
        
        env.storage().persistent().set(&DataKey::Task(id), &task);
        env.storage().persistent().extend_ttl(&DataKey::Task(id), 17280, 518400);

        // Emit event: ["task_updated", id] -> progress
        env.events().publish(
            (Symbol::new(&env, "task_updated"), id),
            progress
        );
    }

    pub fn complete_task(env: Env, id: u32, hash: BytesN<32>) {
        let mut task: TaskMetadata = env
            .storage()
            .persistent()
            .get(&DataKey::Task(id))
            .expect("Task not found");
        task.owner.require_auth();

        task.progress = 100;
        task.status = Symbol::new(&env, "Completed");

        env.storage().persistent().set(&DataKey::Task(id), &task);
        env.storage().persistent().extend_ttl(&DataKey::Task(id), 17280, 518400);

        // Emit event: ["task_completed", id] -> hash
        env.events().publish(
            (Symbol::new(&env, "task_completed"), id),
            hash.clone()
        );

        // DYNAMIC INTER-CONTRACT CALL: Call Progress Registry Contract
        let registry_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::RegistryAddress)
            .expect("Registry Address not set");

        // Format dynamic args vec: [task_id, hash, owner]
        let args: Vec<soroban_sdk::Val> = soroban_sdk::vec![
            &env,
            id.into_val(&env),
            hash.into_val(&env),
            task.owner.into_val(&env)
        ];

        env.invoke_contract::<()>(&registry_addr, &Symbol::new(&env, "record_proof"), args);
    }

    pub fn get_task(env: Env, id: u32) -> Option<TaskMetadata> {
        env.storage().persistent().get(&DataKey::Task(id))
    }
}

