import { useEffect, useState } from 'react';
import { transactionApi } from '@/lib/api';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

interface Transaction {
  id: number;
  user: string;
  category: number;
  category_name?: string;
  amount: string;
  description: string;
  tx_ref: string;
  status: string;
  date: string;
  created_at: string;
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

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    category: 4,
    amount: '',
    description: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionApi.getAll();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Mock data
      setTransactions([
        { id: 1, user: 'user', category: 4, amount: '85.50', description: 'Weekly grocery shopping', tx_ref: 'tx-001', status: 'Success', date: '2025-12-04T10:00:00Z', created_at: '2025-12-04T10:00:00Z' },
        { id: 2, user: 'user', category: 10, amount: '5000.00', description: 'Monthly salary', tx_ref: 'tx-002', status: 'Success', date: '2025-12-01T09:00:00Z', created_at: '2025-12-01T09:00:00Z' },
        { id: 3, user: 'user', category: 5, amount: '15.99', description: 'Netflix subscription', tx_ref: 'tx-003', status: 'Success', date: '2025-12-03T14:00:00Z', created_at: '2025-12-03T14:00:00Z' },
        { id: 4, user: 'user', category: 3, amount: '45.00', description: 'Uber rides', tx_ref: 'tx-004', status: 'Success', date: '2025-12-02T18:00:00Z', created_at: '2025-12-02T18:00:00Z' },
        { id: 5, user: 'user', category: 2, amount: '32.50', description: 'Restaurant dinner', tx_ref: 'tx-005', status: 'Success', date: '2025-12-02T20:00:00Z', created_at: '2025-12-02T20:00:00Z' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingTransaction(true);
    try {
      await transactionApi.create({
        category: newTransaction.category,
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description,
        tx_ref: `tx-${Date.now()}`,
        status: 'Success',
      });
      toast({
        title: 'Success',
        description: 'Transaction added successfully',
      });
      fetchTransactions();
      setNewTransaction({ category: 4, amount: '', description: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
    } finally {
      setIsAddingTransaction(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryMap[tx.category]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-6 space-y-6 safe-top animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">
            {transactions.length} transactions
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Add Transaction</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="flex h-12 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground"
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: parseInt(e.target.value),
                    })
                  }
                >
                  {Object.entries(categoryMap).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="What was this for?"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddTransaction}
                disabled={isAddingTransaction}
              >
                {isAddingTransaction ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          className="pl-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              id={tx.id}
              category={categoryMap[tx.category] || 'Other'}
              description={tx.description}
              amount={tx.amount}
              date={tx.date}
              type={tx.category === 10 ? 'income' : 'expense'}
              status={tx.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
