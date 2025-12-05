import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { MonthlyChart } from '@/components/charts/MonthlyChart';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  total_balance: string;
  total_income: string;
  total_expenses: string;
  savings_rate: string;
  budget_health: string;
  total_budget_limit: string;
  total_budget_spent: string;
  monthly_data: Array<{ month: string; income: string; expenses: string }>;
  category_spending: Array<any>;
  budgets_overview: Array<{
    id: number;
    category_name: string;
    budget_amount: string;
    spent_amount: string;
    remaining_amount: string;
    percentage_used: string;
  }>;
  upcoming_bills: Array<any>;
  recent_transactions: Array<{
    id: number;
    category: string;
    description: string;
    amount: string;
    date: string;
    status: string;
  }>;
  current_month_income: string;
  current_month_expenses: string;
  current_month_savings: string;
  account_currency: string;
  user_full_name: string;
  total_transactions: number;
  active_categories: number;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await dashboardApi.getMetrics();
        setData(metrics);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Use mock data for demo
        setData({
          total_balance: '12500.00',
          total_income: '5000.00',
          total_expenses: '2500.00',
          savings_rate: '50.00',
          budget_health: '85.00',
          total_budget_limit: '3000.00',
          total_budget_spent: '1800.00',
          monthly_data: [
            { month: 'Jul 2025', income: '4500.00', expenses: '2200.00' },
            { month: 'Aug 2025', income: '4800.00', expenses: '2400.00' },
            { month: 'Sep 2025', income: '5200.00', expenses: '2100.00' },
            { month: 'Oct 2025', income: '4900.00', expenses: '2600.00' },
            { month: 'Nov 2025', income: '5100.00', expenses: '2300.00' },
            { month: 'Dec 2025', income: '5000.00', expenses: '2500.00' },
          ],
          category_spending: [],
          budgets_overview: [
            { id: 1, category_name: 'Food & Dining', budget_amount: '800.00', spent_amount: '650.00', remaining_amount: '150.00', percentage_used: '81.25' },
            { id: 2, category_name: 'Transportation', budget_amount: '400.00', spent_amount: '280.00', remaining_amount: '120.00', percentage_used: '70.00' },
          ],
          upcoming_bills: [],
          recent_transactions: [
            { id: 1, category: 'Groceries', description: 'Weekly shopping', amount: '85.50', date: '2025-12-04T10:00:00Z', status: 'Success' },
            { id: 2, category: 'Salary', description: 'Monthly salary', amount: '5000.00', date: '2025-12-01T09:00:00Z', status: 'Success' },
            { id: 3, category: 'Entertainment', description: 'Netflix subscription', amount: '15.99', date: '2025-12-03T14:00:00Z', status: 'Success' },
          ],
          current_month_income: '5000.00',
          current_month_expenses: '2500.00',
          current_month_savings: '2500.00',
          account_currency: 'USD',
          user_full_name: 'John Doe',
          total_transactions: 45,
          active_categories: 8,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-6 safe-top">
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="px-4 py-6 space-y-6 safe-top animate-fade-in">
      {/* Balance Card */}
      <BalanceCard
        balance={data.total_balance}
        currency={data.account_currency}
        savingsRate={data.savings_rate}
        userName={data.user_full_name.split(' ')[0]}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Income"
          value={`${parseFloat(data.current_month_income).toLocaleString()}`}
          subtitle="This month"
          icon={ArrowDownLeft}
          variant="income"
        />
        <StatCard
          title="Expenses"
          value={`${parseFloat(data.current_month_expenses).toLocaleString()}`}
          subtitle="This month"
          icon={ArrowUpRight}
          variant="expense"
        />
      </div>

      {/* Monthly Chart */}
      <MonthlyChart data={data.monthly_data} />

      {/* Budget Health */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Budget Health"
          value={`${parseFloat(data.budget_health).toFixed(0)}%`}
          subtitle="On track"
          icon={Target}
        />
        <StatCard
          title="Savings"
          value={`${parseFloat(data.current_month_savings).toLocaleString()}`}
          subtitle="This month"
          icon={PiggyBank}
          variant="budget"
        />
      </div>

      {/* Budgets Overview */}
      {data.budgets_overview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Budgets</h2>
            <Link
              to="/budgets"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {data.budgets_overview.slice(0, 2).map((budget) => (
              <BudgetCard
                key={budget.id}
                id={budget.id}
                categoryName={budget.category_name}
                budgetAmount={budget.budget_amount}
                spentAmount={budget.spent_amount}
                remainingAmount={budget.remaining_amount}
                percentageUsed={budget.percentage_used}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {data.recent_transactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {data.recent_transactions.slice(0, 3).map((tx) => (
              <TransactionItem
                key={tx.id}
                id={tx.id}
                category={tx.category}
                description={tx.description}
                amount={tx.amount}
                date={tx.date}
                type={tx.category === 'Salary' ? 'income' : 'expense'}
                status={tx.status}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
