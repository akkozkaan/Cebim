'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'outcome';
  date: string;
  categoryName: string;
}

interface TransactionManagerProps {
  categoryId: string;
  categoryName: string;
  onTransactionUpdate?: () => void;
}

// Create a key for localStorage based on categoryId
const getStorageKey = (categoryId: string) => `transactions_${categoryId}`;

export default function TransactionManager({ categoryId, categoryName, onTransactionUpdate }: TransactionManagerProps) {
  // Initialize transactions from localStorage if available
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getStorageKey(categoryId));
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'outcome'>('income');

  // Save transactions to localStorage whenever they change
  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(categoryId), JSON.stringify(newTransactions));
    }
  };

  const addTransaction = () => {
    if (!amount || !description) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      type,
      date: new Date().toISOString(),
      categoryName
    };

    const updatedTransactions = [...transactions, newTransaction];
    saveTransactions(updatedTransactions);
    
    // Dispatch a custom event to notify parent components
    window.dispatchEvent(new Event('transactionUpdated'));
    // Call the callback if provided
    onTransactionUpdate?.();

    // Reset form
    setAmount('');
    setDescription('');
    setType('income');
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    saveTransactions(updatedTransactions);
    
    // Dispatch a custom event to notify parent components
    window.dispatchEvent(new Event('transactionUpdated'));
    // Call the callback if provided
    onTransactionUpdate?.();
  };

  const total = transactions.reduce((sum, t) => 
    sum + (t.type === 'income' ? t.amount : -t.amount), 0
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{categoryName}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'outcome')}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="income">Income</option>
          <option value="outcome">Outcome</option>
        </select>
        <button
          onClick={addTransaction}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Transactions</h4>
          <span className={`font-medium ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Balance: ${total.toFixed(2)}
          </span>
        </div>
        <div className="space-y-2">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                  <span className={`text-sm ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ({transaction.type})
                  </span>
                </div>
                <p className="text-sm text-gray-600">{transaction.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()} - {transaction.categoryName}
                </p>
              </div>
              <button
                onClick={() => deleteTransaction(transaction.id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 