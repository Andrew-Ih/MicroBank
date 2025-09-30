import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  Plus, 
  Minus,
  TrendingUp,
  Activity,
  DollarSign,
  CreditCard,
  Loader2
} from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionHistory } from "./TransactionHistory";
import { useAccount } from "@/hooks/useAccount";
import heroImage from "@/assets/fintech-hero.jpg";

const mockTransactions = [
  {
    id: "tx_1",
    type: "deposit" as const,
    amount: 2500.00,
    status: "approved" as const,
    description: "Salary Deposit",
    timestamp: "2024-01-15T10:30:00Z",
    balance: 125430.50
  },
  // ... other mock transactions
];

export function Dashboard() {
  const { account, loading, error } = useAccount();
  const [showBalance, setShowBalance] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your account...</span>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load account</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    }).format(amount);
  };

  const handleTransaction = (type: 'deposit' | 'withdraw') => {
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 lg:p-12">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Welcome back to Microbank Lite+
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your finances with confidence
              </p>
            </div>
            <div className="hidden lg:block">
              <img 
                src={heroImage} 
                alt="Financial Dashboard" 
                className="w-48 h-24 object-cover rounded-2xl opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-fintech card-balance">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Balance
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-6 w-6 p-0 hover:bg-primary/10"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalance ? formatCurrency(account.balance) : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {account.accountNumber}
            </p>
          </CardContent>
        </Card>

        {/* Other cards remain the same */}
        <Card className="card-fintech">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$0</div>
            <p className="text-xs text-muted-foreground">New account</p>
          </CardContent>
        </Card>

        <Card className="card-fintech">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <Activity className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">-$0</div>
            <p className="text-xs text-muted-foreground">New account</p>
          </CardContent>
        </Card>

        <Card className="card-fintech">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-fintech">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Manage your account with these quick actions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button 
            className="btn-gradient"
            onClick={() => handleTransaction('deposit')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Deposit Money
          </Button>
          <Button 
            variant="outline" 
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => handleTransaction('withdraw')}
          >
            <Minus className="h-4 w-4 mr-2" />
            Withdraw Money
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <TransactionHistory transactions={mockTransactions} />

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          type={transactionType}
          onClose={() => setShowTransactionForm(false)}
          account={account}
        />
      )}
    </div>
  );
}
