import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { apiService, UserWithAccount } from '@/services/api';

interface Account {
  id: string;
  balance: number;
  currency: string;
  accountNumber: string;
}

export function useAccount() {
  const { user, isAuthenticated } = useAuth0();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeAccount() {
      if (!isAuthenticated || !user?.email) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        
        // Create user + account (idempotent)
        const result: UserWithAccount = await apiService.createUserWithAccount(user.email);
        
        setAccount({
          id: result.account_id,
          balance: 0, // Start with 0, will be updated by ledger service
          currency: result.currency,
          accountNumber: `**** **** **** ${result.account_id.slice(-4)}`
        });
      } catch (err) {
        console.error('Failed to initialize account:', err);
        setError('Failed to load account');
      } finally {
        setLoading(false);
      }
    }

    initializeAccount();
  }, [isAuthenticated, user?.email]);

  return { account, loading, error };
}
