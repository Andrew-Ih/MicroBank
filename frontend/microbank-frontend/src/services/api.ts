const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface UserWithAccount {
  user_id: string;
  email: string;
  account_id: string;
  currency: string;
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  status: string;
}

export interface CreateTransactionRequest {
  account_id: string;
  kind: 'deposit' | 'withdraw';
  amount_cents: number;
}

class ApiService {
  private generateIdempotencyKey(): string {
    return crypto.randomUUID();
  }

  async createUserWithAccount(email: string): Promise<UserWithAccount> {
    const response = await fetch(`${API_BASE_URL}/v1/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  }

  async createTransaction(request: CreateTransactionRequest): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': this.generateIdempotencyKey()
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  }
}

export const apiService = new ApiService();
