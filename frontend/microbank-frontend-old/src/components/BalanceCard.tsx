import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  currency: string;
  accountId: string;
  className?: string;
}

export function BalanceCard({ balance, currency, accountId, className }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [previousBalance, setPreviousBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate when balance changes
  useEffect(() => {
    if (balance !== previousBalance) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousBalance(balance);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [balance, previousBalance]);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const balanceChange = balance - previousBalance;
  const hasPositiveChange = balanceChange > 0;

  return (
    <Card className={cn(
      "bg-gradient-card border-0 shadow-medium hover:shadow-large transition-all duration-300",
      isAnimating && "animate-glow-pulse",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <Badge variant="outline" className="text-xs">
                {currency}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="h-8 w-8 p-0"
          >
            {isBalanceVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            {isBalanceVisible ? (
              <h2 className={cn(
                "text-3xl font-bold tracking-tight transition-all duration-300",
                isAnimating && "scale-105"
              )}>
                {formatBalance(balance)}
              </h2>
            ) : (
              <h2 className="text-3xl font-bold tracking-tight">
                ••••••
              </h2>
            )}
          </div>

          {isAnimating && balanceChange !== 0 && (
            <div className={cn(
              "flex items-center space-x-1 text-sm animate-slide-up",
              hasPositiveChange ? "text-success" : "text-destructive"
            )}>
              <TrendingUp className={cn(
                "h-4 w-4",
                !hasPositiveChange && "rotate-180"
              )} />
              <span>
                {hasPositiveChange ? '+' : ''}{formatBalance(balanceChange)}
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Account ID: {accountId.slice(0, 8)}...{accountId.slice(-4)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}