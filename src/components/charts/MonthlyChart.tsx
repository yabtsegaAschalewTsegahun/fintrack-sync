import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyData {
  month: string;
  income: string;
  expenses: string;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const chartData = data.map((item) => ({
    name: item.month.split(' ')[0],
    income: parseFloat(item.income),
    expenses: parseFloat(item.expenses),
  }));

  return (
    <div className="p-5 rounded-2xl bg-card shadow-card">
      <h3 className="font-semibold text-foreground mb-4">Monthly Overview</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0 72% 51%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 9%)',
                border: '1px solid hsl(222 47% 18%)',
                borderRadius: '12px',
                boxShadow: '0 4px 24px hsl(222 47% 4% / 0.5)',
              }}
              labelStyle={{ color: 'hsl(210 40% 98%)' }}
              formatter={(value: number) =>
                value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              }
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="hsl(0 72% 51%)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
      </div>
    </div>
  );
};
