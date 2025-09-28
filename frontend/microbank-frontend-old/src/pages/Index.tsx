import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionHistory } from '@/components/TransactionHistory';
import { TransactionForm } from '@/components/TransactionForm';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/lib/api';

const Index = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock WebSocket connection - in production this would connect to your Notifications service
  const { connectionStatus, lastMessage } = useWebSocket(
    'ws://localhost:3003/ws', // Your Rails Notifications service WebSocket endpoint
    api.DEMO_USER.id
  );

  // Queries
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['balance', api.DEMO_ACCOUNT.id],
    queryFn: () => api.getBalance(api.DEMO_ACCOUNT.id),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', api.DEMO_ACCOUNT.id],
    queryFn: () => api.getTransactions(api.DEMO_ACCOUNT.id),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      // Optimistically update the UI
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error) => {
      console.error('Transaction failed:', error);
    },
  });

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      console.log('WebSocket message received:', lastMessage);
      
      switch (lastMessage.type) {
        case 'transaction_settled':
          // Update balance and transactions in real-time
          queryClient.invalidateQueries({ queryKey: ['balance'] });
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          
          setNotificationCount(prev => prev + 1);
          toast({
            title: 'Transaction Completed',
            description: `Your transaction has been ${lastMessage.data.outcome}`,
            variant: lastMessage.data.outcome === 'approved' ? 'default' : 'destructive',
          });
          break;
          
        case 'balance_updated':
          queryClient.invalidateQueries({ queryKey: ['balance'] });
          break;
          
        default:
          console.log('Unknown message type:', lastMessage.type);
      }
    }
  }, [lastMessage, queryClient, toast]);

  // Mock WebSocket for demo purposes
  useEffect(() => {
    const handleMockMessage = (event: CustomEvent) => {
      const message = event.detail;
      
      // Simulate balance update
      queryClient.setQueryData(
        ['balance', api.DEMO_ACCOUNT.id],
        (oldData: { balance_cents: number; currency: string; last_updated?: string } | undefined) => {
          if (oldData && message.data.balance_cents !== undefined) {
            return {
              ...oldData,
              balance_cents: message.data.balance_cents,
              last_updated: new Date().toISOString(),
            };
          }
          return oldData;
        }
      );

      setNotificationCount(prev => prev + 1);
      toast({
        title: 'Transaction Completed',
        description: `Your transaction has been ${message.data.outcome}`,
        variant: message.data.outcome === 'approved' ? 'default' : 'destructive',
      });
    };

    window.addEventListener('mock-websocket-message', handleMockMessage as EventListener);
    return () => window.removeEventListener('mock-websocket-message', handleMockMessage as EventListener);
  }, [queryClient, toast]);

  const handleCreateTransaction = async (data: Parameters<typeof api.createTransaction>[0]) => {
    return createTransactionMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        connectionStatus={connectionStatus}
        notificationCount={notificationCount}
        user={{
          id: api.DEMO_USER.id,
          email: api.DEMO_USER.email,
          name: 'Demo User',
        }}
      />

      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome to Microbank Lite+
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience modern banking with real-time updates, secure transactions, and a beautiful interface.
          </p>
        </div>

        {/* Balance Card */}
        <div className="flex justify-center">
          <BalanceCard
            balance={balance?.balance_cents || 0}
            currency={balance?.currency || 'USD'}
            accountId={api.DEMO_ACCOUNT.id}
            className="w-full max-w-md"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="space-y-6">
            <TransactionForm
              accounts={[{
                id: api.DEMO_ACCOUNT.id,
                currency: api.DEMO_ACCOUNT.currency,
              }]}
              onSubmit={handleCreateTransaction}
              isLoading={createTransactionMutation.isPending}
            />
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <TransactionHistory
              transactions={transactions || []}
              currency={api.DEMO_ACCOUNT.currency}
              isLoading={transactionsLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border mt-16">
          <p className="text-sm text-muted-foreground">
            Microbank Lite+ - Polyglot Microservices Banking Platform
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Rails • Kotlin • React • SNS/SQS • S3 • PostgreSQL • Observability
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
