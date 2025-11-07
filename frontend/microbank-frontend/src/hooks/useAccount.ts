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

  const fetchAccountData = async () => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      
      // Create user + account (idempotent)
      const result: UserWithAccount = await apiService.createUserWithAccount(user.email);
      
      // Fetch real balance from ledger service
      const balanceData = await apiService.getAccountBalance(result.account_id);
      
      setAccount({
        id: result.account_id,
        balance: balanceData.balanceCents / 100, // Convert cents to dollars
        currency: result.currency,
        accountNumber: `**** **** **** ${result.account_id.slice(-4)}`
      });
    } catch (err) {
      console.error('Failed to initialize account:', err);
      setError('Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [isAuthenticated, user?.email]);

  // Listen for refresh events from notifications
  useEffect(() => {
    const handleRefresh = () => {
      if (account?.id) {
        fetchAccountData();
      }
    };

    window.addEventListener('refreshData', handleRefresh);
    return () => window.removeEventListener('refreshData', handleRefresh);
  }, [account?.id]);

  return { account, loading, error };
}
