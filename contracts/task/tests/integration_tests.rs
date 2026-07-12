use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, Symbol, Vec, String};
use task_contract::{TaskContract, TaskContractClient};
use registry_contract::{ProgressRegistryContract, ProgressRegistryContractClient};

#[test]
fn test_contract_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);

    // Register contracts
    let registry_id = env.register(ProgressRegistryContract, (admin.clone(), admin.clone()));
    let task_id = env.register(TaskContract, (registry_id.clone(),));

    // Let's instantiate clients
    let task_client = TaskContractClient::new(&env, &task_id);
    let registry_client = ProgressRegistryContractClient::new(&env, &registry_id);

    // Update task contract address inside registry to real contract id
    registry_client.set_task_contract(&task_id);

    // 1. Create Task
    let description = String::from_str(&env, "Build Stellar app");
    let tags: Vec<Symbol> = soroban_sdk::vec![&env, Symbol::new(&env, "Rust")];
    task_client.create_task(&1, &description, &tags, &owner);

    let t = task_client.get_task(&1).unwrap();
    assert_eq!(t.progress, 0);
    assert_eq!(t.owner, owner);

    // 2. Update progress
    task_client.update_progress(&1, &45);
    let t = task_client.get_task(&1).unwrap();
    assert_eq!(t.progress, 45);

    // 3. Complete task & trigger inter-contract calls
    let dummy_hash = BytesN::from_array(&env, &[7u8; 32]);
    task_client.complete_task(&1, &dummy_hash);

    // Check complete state
    let t = task_client.get_task(&1).unwrap();
    assert_eq!(t.progress, 100);
    assert_eq!(t.status, Symbol::new(&env, "Completed"));

    // Verify registry contract received and saved proof record
    let proof = registry_client.get_proof(&1).unwrap();
    assert_eq!(proof.hash, dummy_hash);
    assert_eq!(proof.owner, owner);
}
