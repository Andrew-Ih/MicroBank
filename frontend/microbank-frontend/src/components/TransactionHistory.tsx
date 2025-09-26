import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  account_id: string;
  kind: 'deposit' | 'withdraw';
  amount_cents: number;
  status: 'pending' | 'approved' | 'rejected';
  outcome?: 'approved' | 'rejected';
  requested_at: string;
  applied_at?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  currency: string;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function TransactionHistory({ 
  transactions, 
  currency, 
  onLoadMore, 
  isLoading = false 
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.kind === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-card border-border shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <span>Transaction History</span>
          <Badge variant="outline" className="ml-auto">
            {filteredTransactions.length} transactions
          </Badge>
        </CardTitle>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdraw">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-0 max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                  index !== filteredTransactions.length - 1 && "border-b border-border",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    transaction.kind === 'deposit' 
                      ? "bg-success/10 text-success" 
                      : "bg-destructive/10 text-destructive"
                  )}>
                    {transaction.kind === 'deposit' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium capitalize">
                        {transaction.kind}
                      </p>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.requested_at)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {transaction.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className={cn(
                    "font-semibold",
                    transaction.kind === 'deposit' && transaction.status === 'approved'
                      ? "text-success"
                      : transaction.kind === 'withdraw' && transaction.status === 'approved'
                      ? "text-destructive"
                      : "text-foreground"
                  )}>
                    {transaction.kind === 'deposit' ? '+' : '-'}
                    {formatAmount(transaction.amount_cents)}
                  </p>
                  <Badge 
                    variant={getStatusBadgeVariant(transaction.status)}
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {onLoadMore && (
          <div className="p-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={onLoadMore} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}