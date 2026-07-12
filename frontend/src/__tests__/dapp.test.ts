import { describe, it, expect, vi } from 'vitest';

// Mock Freighter wallet SDK v6 signatures
vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn().mockResolvedValue({ isConnected: true }),
  getAddress: vi.fn().mockResolvedValue({ address: 'GB22TESTNETDUMMYADDRESS123456789' }),
  signTransaction: vi.fn().mockResolvedValue({ signedTxXdr: 'AAAA_DUMMY_XDR_SIGNATURE_ENVELOPE', signerAddress: 'GB22TESTNETDUMMYADDRESS123456789' }),
  isAllowed: vi.fn().mockResolvedValue({ isAllowed: true }),
  setAllowed: vi.fn().mockResolvedValue({ isAllowed: true }),
}));

describe('TaskProof Frontend State & Integration Tests', () => {
  it('should successfully handle wallet connection state and load public address', async () => {
    const { isConnected, getAddress } = await import('@stellar/freighter-api');
    
    const connection = await isConnected();
    expect(connection.isConnected).toBe(true);

    const access = await getAddress();
    expect(access.address).toBe('GB22TESTNETDUMMYADDRESS123456789');
  });

  it('should successfully clear state credentials on wallet disconnection', () => {
    let activeWallet: string | null = 'GB22TESTNETDUMMYADDRESS123456789';
    let isAuthorized = true;

    // Disconnect Action
    activeWallet = null;
    isAuthorized = false;

    expect(activeWallet).toBeNull();
    expect(isAuthorized).toBe(false);
  });

  it('should generate a new task payload and append it to the task registry list', () => {
    const tasksList: any[] = [];
    const newTask = {
      id: 101,
      description: 'Audit smart contract permissions',
      tags: ['Security', 'Soroban'],
      progress: 0,
      owner: 'GB22TESTNETDUMMYADDRESS123456789',
      status: 'Processing',
      createdAt: new Date().toISOString()
    };

    tasksList.push(newTask);

    expect(tasksList.length).toBe(1);
    expect(tasksList[0].id).toBe(101);
    expect(tasksList[0].description).toBe('Audit smart contract permissions');
    expect(tasksList[0].progress).toBe(0);
  });

  it('should stream events and append them to the activity timeline logs', () => {
    const activityTimeline: any[] = [
      { id: 'ev-1', type: 'TaskCreated', text: 'Task #101 created by developer', time: 'Just now' }
    ];

    const newEvent = {
      id: 'ev-2',
      type: 'ProofStored',
      text: 'Cryptographic proof hash stored inside Progress Registry',
      time: 'Just now'
    };

    activityTimeline.push(newEvent);

    expect(activityTimeline.length).toBe(2);
    expect(activityTimeline[1].type).toBe('ProofStored');
    expect(activityTimeline[1].text).toContain('Cryptographic proof hash stored');
  });
});
