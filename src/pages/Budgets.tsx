import { useEffect, useState } from 'react';
import { budgetApi } from '@/lib/api';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Target } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

interface Budget {
  id: number;
  user: string;
  category: number;
  category_name?: string;
  amount: string;
  month: string;
  due_date: string | null;
  transaction: number | null;
  spent_amount?: string;
  remaining_amount?: string;
  percentage_used?: string;
}

const categoryMap: Record<number, string> = {
  1: 'Debt',
  2: 'Food',
  3: 'Transportation',
  4: 'Groceries',
  5: 'Entertainment',
  6: 'Utilities',
  7: 'Healthcare',
  8: 'Housing',
  9: 'Shopping',
  10: 'Salary',
  11: 'Investment',
};

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 2,
    amount: '',
    due_date: '',
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await budgetApi.getAll();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      // Mock data
      setBudgets([
        { id: 1, user: 'user', category: 2, amount: '800.00', month: '2025-12', due_date: '2025-12-31', transaction: null, spent_amount: '650.00', remaining_amount: '150.00', percentage_used: '81.25' },
        { id: 2, user: 'user', category: 3, amount: '400.00', month: '2025-12', due_date: '2025-12-31', transaction: null, spent_amount: '280.00', remaining_amount: '120.00', percentage_used: '70.00' },
        { id: 3, user: 'user', category: 5, amount: '200.00', month: '2025-12', due_date: '2025-12-31', transaction: null, spent_amount: '180.00', remaining_amount: '20.00', percentage_used: '90.00' },
        { id: 4, user: 'user', category: 6, amount: '300.00', month: '2025-12', due_date: '2025-12-31', transaction: null, spent_amount: '150.00', remaining_amount: '150.00', percentage_used: '50.00' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBudget = async () => {
    if (!newBudget.amount) {
      toast({
        title: 'Error',
        description: 'Please enter an amount',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingBudget(true);
    try {
      await budgetApi.create({
        category: newBudget.category,
        amount: parseFloat(newBudget.amount),
        due_date: newBudget.due_date || undefined,
      });
      toast({
        title: 'Success',
        description: 'Budget created successfully',
      });
      fetchBudgets();
      setNewBudget({ category: 2, amount: '', due_date: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create budget',
        variant: 'destructive',
      });
    } finally {
      setIsAddingBudget(false);
    }
  };

  const totalBudget = budgets.reduce(
    (sum, b) => sum + parseFloat(b.amount),
    0
  );
  const totalSpent = budgets.reduce(
    (sum, b) => sum + parseFloat(b.spent_amount || '0'),
    0
  );

  return (
    <div className="px-4 py-6 space-y-6 safe-top animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budgets</h1>
          <p className="text-muted-foreground">{budgets.length} active budgets</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Create Budget</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      category: parseInt(e.target.value),
                    })
                  }
                >
                  {Object.entries(categoryMap)
                    .filter(([id]) => parseInt(id) !== 10)
                    .map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Limit</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (Optional)</label>
                <Input
                  type="date"
                  value={newBudget.due_date}
                  onChange={(e) =>
                    setNewBudget({
                      ...newBudget,
                      due_date: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddBudget}
                disabled={isAddingBudget}
              >
                {isAddingBudget ? 'Creating...' : 'Create Budget'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl gradient-budget shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-foreground/10">
            <Target className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm text-foreground/70">Monthly Budget</p>
            <p className="text-2xl font-bold text-foreground">
              ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Spent</span>
          <span className="font-semibold text-foreground">
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-2 h-2 bg-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Budgets List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No budgets yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first budget to start tracking
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              id={budget.id}
              categoryName={categoryMap[budget.category] || 'Other'}
              budgetAmount={budget.amount}
              spentAmount={budget.spent_amount || '0'}
              remainingAmount={budget.remaining_amount || budget.amount}
              percentageUsed={budget.percentage_used || '0'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;
