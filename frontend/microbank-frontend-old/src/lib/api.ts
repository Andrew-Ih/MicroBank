// Mock API functions for the Microbank frontend
// In a real implementation, these would call your Rails/Kotlin services

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
}

export interface Transaction {
  id: string;
  account_id: string;
  kind: 'deposit' | 'withdraw';
  amount_cents: number;
  status: 'pending' | 'approved' | 'rejected';
  outcome?: 'approved' | 'rejected';
  idempotency_key: string;
  requested_at: string;
  applied_at?: string;
}

export interface Balance {
  account_id: string;
  balance_cents: number;
  currency: string;
  last_updated: string;
}

export interface LedgerEntry {
  id: number;
  account_id: string;
  tx_id: string;
  kind: 'credit' | 'debit';
  amount_cents: number;
  created_at: string;
}

// Base URLs - in production these would be your service URLs
const ACCOUNTS_API_BASE = '/api/v1'; // Rails Accounts Service
const LEDGER_API_BASE = '/api/ledger/v1'; // Kotlin Ledger Service
const NOTIFICATIONS_API_BASE = '/api/notifications/v1'; // Rails Notifications Service

// Mock data for demonstration
const mockUser: User = {
  id: 'usr_123456789',
  email: 'demo@microbank.com',
  created_at: new Date().toISOString(),
};

const mockAccount: Account = {
  id: 'acc_987654321',
  user_id: 'usr_123456789',
  currency: 'USD',
  status: 'active',
};

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    account_id: 'acc_987654321',
    kind: 'deposit',
    amount_cents: 50000,
    status: 'approved',
    outcome: 'approved',
    idempotency_key: 'idem_001',
    requested_at: new Date(Date.now() - 3600000).toISOString(),
    applied_at: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'tx_002',
    account_id: 'acc_987654321',
    kind: 'withdraw',
    amount_cents: 15000,
    status: 'approved',
    outcome: 'approved',
    idempotency_key: 'idem_002',
    requested_at: new Date(Date.now() - 1800000).toISOString(),
    applied_at: new Date(Date.now() - 1700000).toISOString(),
  },
  {
    id: 'tx_003',
    account_id: 'acc_987654321',
    kind: 'deposit',
    amount_cents: 25000,
    status: 'pending',
    idempotency_key: 'idem_003',
    requested_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'tx_004',
    account_id: 'acc_987654321',
    kind: 'withdraw',
    amount_cents: 75000,
    status: 'rejected',
    outcome: 'rejected',
    idempotency_key: 'idem_004',
    requested_at: new Date(Date.now() - 7200000).toISOString(),
    applied_at: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: 'tx_005',
    account_id: 'acc_987654321',
    kind: 'deposit',
    amount_cents: 120000,
    status: 'approved',
    outcome: 'approved',
    idempotency_key: 'idem_005',
    requested_at: new Date(Date.now() - 86400000).toISOString(),
    applied_at: new Date(Date.now() - 86350000).toISOString(),
  },
  {
    id: 'tx_006',
    account_id: 'acc_987654321',
    kind: 'withdraw',
    amount_cents: 35000,
    status: 'approved',
    outcome: 'approved',
    idempotency_key: 'idem_006',
    requested_at: new Date(Date.now() - 172800000).toISOString(),
    applied_at: new Date(Date.now() - 172750000).toISOString(),
  },
];

let currentBalance = 60000; // $600.00 in cents

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Functions

export async function createUser(email: string): Promise<User> {
  await delay(500);
  return {
    ...mockUser,
    id: `usr_${Date.now()}`,
    email,
  };
}

export async function createAccount(userId: string, currency: string = 'USD'): Promise<Account> {
  await delay(500);
  return {
    id: `acc_${Date.now()}`,
    user_id: userId,
    currency,
    status: 'active',
  };
}

export async function createTransaction(data: {
  account_id: string;
  kind: 'deposit' | 'withdraw';
  amount_cents: number;
  idempotency_key: string;
}): Promise<Transaction> {
  await delay(1000); // Simulate processing time
  
  const transaction: Transaction = {
    id: `tx_${Date.now()}`,
    ...data,
    status: 'pending',
    requested_at: new Date().toISOString(),
  };

  // Simulate processing after a delay
  setTimeout(() => {
    // Simulate settlement via WebSocket
    const settledTransaction = {
      ...transaction,
      status: 'approved' as const,
      outcome: 'approved' as const,
      applied_at: new Date().toISOString(),
    };

    // Update balance
    if (data.kind === 'deposit') {
      currentBalance += data.amount_cents;
    } else {
      currentBalance = Math.max(0, currentBalance - data.amount_cents);
    }

    // Simulate WebSocket message
    window.dispatchEvent(new CustomEvent('mock-websocket-message', {
      detail: {
        type: 'transaction_settled',
        data: {
          tx_id: transaction.id,
          account_id: data.account_id,
          outcome: 'approved',
          balance_cents: currentBalance,
          applied_at: settledTransaction.applied_at,
        },
        timestamp: new Date().toISOString(),
      }
    }));
  }, 2000);

  return transaction;
}

export async function getBalance(accountId: string): Promise<Balance> {
  await delay(300);
  return {
    account_id: accountId,
    balance_cents: currentBalance,
    currency: 'USD',
    last_updated: new Date().toISOString(),
  };
}

export async function getTransactions(accountId: string, limit: number = 50): Promise<Transaction[]> {
  await delay(400);
  return mockTransactions.slice(0, limit);
}

export async function getLedgerEntries(accountId: string, limit: number = 50): Promise<LedgerEntry[]> {
  await delay(400);
  return mockTransactions.map((tx, index) => ({
    id: index + 1,
    account_id: tx.account_id,
    tx_id: tx.id,
    kind: tx.kind === 'deposit' ? 'credit' : 'debit',
    amount_cents: tx.amount_cents,
    created_at: tx.applied_at || tx.requested_at,
  }));
}

export async function getPresignedUploadUrl(txId: string): Promise<{ url: string; fields: Record<string, string> }> {
  await delay(300);
  return {
    url: 'https://mock-s3-bucket.s3.amazonaws.com/',
    fields: {
      key: `receipts/${txId}.pdf`,
      policy: 'mock-policy',
      signature: 'mock-signature',
    },
  };
}

// Mock user and account data for demo
export const DEMO_USER = mockUser;
export const DEMO_ACCOUNT = mockAccount;