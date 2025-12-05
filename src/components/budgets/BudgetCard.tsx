import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface BudgetCardProps {
  id: number;
  categoryName: string;
  budgetAmount: string;
  spentAmount: string;
  remainingAmount: string;
  percentageUsed: string;
}

export const BudgetCard = ({
  categoryName,
  budgetAmount,
  spentAmount,
  remainingAmount,
  percentageUsed,
}: BudgetCardProps) => {
  const percentage = parseFloat(percentageUsed);
  const isOverBudget = percentage > 100;
  const isNearLimit = percentage > 80;

  const formatAmount = (amount: string) =>
    parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-5 rounded-2xl bg-card shadow-card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{categoryName}</h3>
          <p className="text-sm text-muted-foreground">
            {formatAmount(spentAmount)} / {formatAmount(budgetAmount)}
          </p>
        </div>
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            isOverBudget
              ? 'bg-destructive/10 text-destructive'
              : isNearLimit
              ? 'bg-warning/10 text-warning'
              : 'bg-success/10 text-success'
          )}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>

      <Progress
        value={Math.min(percentage, 100)}
        className={cn(
          'h-2',
          isOverBudget
            ? '[&>div]:bg-destructive'
            : isNearLimit
            ? '[&>div]:bg-warning'
            : '[&>div]:bg-success'
        )}
      />

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Remaining</span>
        <span
          className={cn(
            'font-semibold',
            isOverBudget ? 'text-destructive' : 'text-success'
          )}
        >
          {isOverBudget ? '-' : ''} {formatAmount(remainingAmount)}
        </span>
      </div>
    </div>
  );
};
