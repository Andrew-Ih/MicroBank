import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, CreditCard, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  account_id: z.string().uuid('Invalid account ID'),
  kind: z.enum(['deposit', 'withdraw'], {
    required_error: 'Please select a transaction type',
  }),
  amount_cents: z.number().positive('Amount must be greater than 0'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  accounts: Array<{ id: string; currency: string; }>;
  onSubmit: (data: TransactionFormData & { idempotency_key: string }) => Promise<void>;
  isLoading?: boolean;
}

export function TransactionForm({ accounts, onSubmit, isLoading = false }: TransactionFormProps) {
  const [selectedType, setSelectedType] = useState<'deposit' | 'withdraw'>('deposit');
  const { toast } = useToast();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      kind: 'deposit',
    },
  });

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const idempotencyKey = crypto.randomUUID();
      await onSubmit({
        ...data,
        idempotency_key: idempotencyKey,
      });
      
      form.reset();
      toast({
        title: 'Transaction submitted',
        description: `Your ${data.kind} request has been processed.`,
      });
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const selectedAccount = accounts.find(acc => acc.id === form.watch('account_id'));

  return (
    <Card className="bg-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>New Transaction</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Transaction Type Selection */}
            <FormField
              control={form.control}
              name="kind"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {(['deposit', 'withdraw'] as const).map((type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={field.value === type ? 'default' : 'outline'}
                        onClick={() => {
                          field.onChange(type);
                          setSelectedType(type);
                        }}
                        className={cn(
                          "h-20 flex-col space-y-2 transition-all",
                          field.value === type && type === 'deposit' && "bg-gradient-success hover:bg-gradient-success/90",
                          field.value === type && type === 'withdraw' && "bg-destructive hover:bg-destructive/90"
                        )}
                      >
                        {type === 'deposit' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                        <span className="capitalize font-medium">{type}</span>
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Selection */}
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center space-x-2">
                            <span>{account.id.slice(0, 8)}...</span>
                            <Badge variant="outline">{account.currency}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Input */}
            <FormField
              control={form.control}
              name="amount_cents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount
                    {selectedAccount && (
                      <Badge variant="outline" className="ml-2">
                        {selectedAccount.currency}
                      </Badge>
                    )}
                  </FormLabel>
                  <div className="relative">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="pr-4 text-lg font-mono transition-all focus:ring-2 focus:ring-primary/20"
                      value={field.value ? (field.value / 100).toFixed(2) : ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and decimal point
                        if (!/^\d*\.?\d{0,2}$/.test(value)) return;
                        
                        const numValue = parseFloat(value) || 0;
                        field.onChange(Math.round(numValue * 100)); // Convert to cents
                      }}
                      onBlur={() => {
                        // Format on blur to ensure proper decimal places
                        if (field.value) {
                          const formatted = (field.value / 100).toFixed(2);
                          field.onChange(Math.round(parseFloat(formatted) * 100));
                        }
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                      {selectedAccount?.currency || 'USD'}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isLoading || !form.formState.isValid}
              className={cn(
                "w-full h-12 font-medium transition-all",
                selectedType === 'deposit' 
                  ? "bg-gradient-success hover:bg-gradient-success/90" 
                  : "bg-destructive hover:bg-destructive/90"
              )}
            >
              {isLoading ? 'Processing...' : `Submit ${selectedType}`}
            </Button>

            {/* Receipt Upload (Optional) */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  Upload Receipt (Optional)
                </Label>
                <Button type="button" variant="ghost" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}