import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  balance: string;
  currency: string;
  savingsRate: string;
  userName?: string;
}

export const BalanceCard = ({
  balance,
  currency,
  savingsRate,
  userName,
}: BalanceCardProps) => {
  const [isHidden, setIsHidden] = useState(false);

  const formatBalance = (bal: string) => {
    const num = parseFloat(bal);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-primary p-6 shadow-glow">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-foreground/5" />
      <div className="absolute -right-4 top-12 w-20 h-20 rounded-full bg-foreground/5" />
      
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/70">
              {userName ? `Hello, ${userName}` : 'Total Balance'}
            </p>
            <p className="text-xs text-primary-foreground/50 mt-0.5">
              {userName && 'Total Balance'}
            </p>
          </div>
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="p-2 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
          >
            {isHidden ? (
              <EyeOff className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Eye className="w-5 h-5 text-primary-foreground" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-primary-foreground/70">
              {currency}
            </span>
            <span className="text-4xl font-bold text-primary-foreground tracking-tight">
              {isHidden ? '••••••' : formatBalance(balance)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-foreground/10">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">
              {savingsRate}%
            </span>
          </div>
          <span className="text-sm text-primary-foreground/70">Savings Rate</span>
        </div>
      </div>
    </div>
  );
};
