#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProofRecord {
    pub hash: BytesN<32>,
    pub owner: Address,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TaskContract,
    Proof(u32), // task_id -> ProofRecord
}

#[contract]
pub struct ProgressRegistryContract;

#[contractimpl]
impl ProgressRegistryContract {
    pub fn __constructor(env: Env, admin: Address, task_contract: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TaskContract, &task_contract);
    }

    pub fn record_proof(env: Env, task_id: u32, hash: BytesN<32>, owner: Address) {
        // Authenticate: must be called by the designated Task Contract
        let task_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::TaskContract)
            .expect("Task Contract Address not set");
        task_contract.require_auth();

        let record = ProofRecord {
            hash: hash.clone(),
            owner: owner.clone(),
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Proof(task_id), &record);
        
        // Extend TTL for storage rent
        env.storage().persistent().extend_ttl(&DataKey::Proof(task_id), 17280, 518400);

        // Emit event: ["proof_stored", task_id] -> hash
        env.events().publish(
            (Symbol::new(&env, "proof_stored"), task_id),
            hash
        );
    }

    pub fn set_task_contract(env: Env, task_contract: Address) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();
        env.storage().instance().set(&DataKey::TaskContract, &task_contract);
    }

    pub fn get_proof(env: Env, task_id: u32) -> Option<ProofRecord> {
        env.storage().persistent().get(&DataKey::Proof(task_id))
    }
}
