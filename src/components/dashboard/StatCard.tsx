import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'income' | 'expense' | 'budget';
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) => {
  const variants = {
    default: 'gradient-card',
    income: 'gradient-income',
    expense: 'gradient-expense',
    budget: 'gradient-budget',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 shadow-card transition-all duration-300 hover:scale-[1.02]',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground/70">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-foreground/60">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-xl bg-foreground/10">
            <Icon className="w-5 h-5 text-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};
