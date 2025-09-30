import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

export function useTransactions(accountId: string | null) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return;
    
    try {
      const data = await apiService.getAccountTransactions(accountId);
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, refetch: fetchTransactions };
}
