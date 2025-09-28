import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  timestamp: string;
  balance: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const statusVariants = {
    approved: 'status-approved',
    rejected: 'status-rejected', 
    pending: 'status-pending',
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={`${statusVariants[status as keyof typeof statusVariants]} text-xs px-2 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="card-fintech">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Your latest account activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`card-transaction flex items-center justify-between p-4 rounded-xl border animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'deposit' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{transaction.description}</p>
                    {getStatusIcon(transaction.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`font-semibold ${
                    transaction.type === 'deposit' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="hover:bg-accent/50">
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}