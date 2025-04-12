'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'outcome';
  date: string;
}

interface TransactionManagerProps {
  categoryId: string;
  categoryName: string;
}

export default function TransactionManager({ categoryId, categoryName }: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'outcome'>('income');

  const addTransaction = () => {
    if (amount && description) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        date: new Date().toISOString(),
      };
      setTransactions([...transactions, newTransaction]);
      setAmount('');
      setDescription('');
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
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
                <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                <span className={`ml-2 text-sm ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({transaction.type})
                </span>
                <p className="text-sm text-gray-600">{transaction.description}</p>
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