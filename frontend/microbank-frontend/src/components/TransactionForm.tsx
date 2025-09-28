import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: string;
  balance: number;
  currency: string;
  accountNumber: string;
}

interface TransactionFormProps {
  type: 'deposit' | 'withdraw';
  onClose: () => void;
  account: Account;
}

export function TransactionForm({ type, onClose, account }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (type === 'withdraw' && amountNum > account.balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Initiated`,
      description: `Your ${type} of ${formatCurrency(amountNum)} is being processed`,
      variant: "default",
    });
    
    setIsLoading(false);
    onClose();
  };

  const isWithdraw = type === 'withdraw';
  const newBalance = isWithdraw 
    ? account.balance - parseFloat(amount || '0')
    : account.balance + parseFloat(amount || '0');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md card-fintech">
        <DialogHeader className="text-center">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            isWithdraw ? 'bg-destructive/10' : 'bg-success/10'
          }`}>
            {isWithdraw ? (
              <ArrowDownLeft className="h-6 w-6 text-destructive" />
            ) : (
              <ArrowUpRight className="h-6 w-6 text-success" />
            )}
          </div>
          <DialogTitle className="text-2xl">
            {isWithdraw ? 'Withdraw Money' : 'Deposit Money'}
          </DialogTitle>
          <DialogDescription>
            {isWithdraw 
              ? 'Transfer money from your account' 
              : 'Add money to your account'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="gradient-card border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-lg font-semibold">{formatCurrency(account.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="text-sm font-medium">{account.accountNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg h-12 mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder={`Enter description for this ${type}...`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          {/* Balance Preview */}
          {amount && parseFloat(amount) > 0 && (
            <Card className={`border-dashed ${
              isWithdraw && newBalance < 0 
                ? 'border-destructive/50 bg-destructive/5' 
                : 'border-success/50 bg-success/5'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New Balance</span>
                  <span className={`font-semibold ${
                    isWithdraw && newBalance < 0 ? 'text-destructive' : 'text-success'
                  }`}>
                    {formatCurrency(newBalance)}
                  </span>
                </div>
                {isWithdraw && newBalance < 0 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Insufficient funds
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${isWithdraw ? 'bg-destructive hover:bg-destructive/90' : 'btn-gradient'}`}
              disabled={isLoading || (isWithdraw && newBalance < 0)}
            >
              {isLoading ? 'Processing...' : `${isWithdraw ? 'Withdraw' : 'Deposit'} ${formatCurrency(parseFloat(amount || '0'))}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}