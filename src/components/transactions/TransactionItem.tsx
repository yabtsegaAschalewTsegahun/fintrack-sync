import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionItemProps {
  id: number;
  category: string;
  description: string;
  amount: string;
  date: string;
  type: 'income' | 'expense';
  status: string;
}

export const TransactionItem = ({
  category,
  description,
  amount,
  date,
  type,
  status,
}: TransactionItemProps) => {
  const isIncome = type === 'income';
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');
  const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card hover:bg-secondary/50 transition-all duration-200">
      <div
        className={cn(
          'p-3 rounded-xl',
          isIncome ? 'bg-success/10' : 'bg-destructive/10'
        )}
      >
        {isIncome ? (
          <ArrowDownLeft className="w-5 h-5 text-success" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-destructive" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{category}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              status === 'Success'
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
            )}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="text-right">
        <p
          className={cn(
            'font-bold',
            isIncome ? 'text-success' : 'text-destructive'
          )}
        >
          {isIncome ? '+' : '-'} {formattedAmount}
        </p>
      </div>
    </div>
  );
};
