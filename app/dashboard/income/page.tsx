'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'outcome';
  date: string;
  categoryId: string;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
}

const CATEGORIES_STORAGE_KEY = 'income_categories';

export default function IncomePage() {
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    type: 'income' as 'income' | 'outcome'
  });

  // Load categories and transactions
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load categories
    const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const parsedCategories = savedCategories ? JSON.parse(savedCategories) : [];
    setCategories(parsedCategories);

    // Load all transactions
    const allTransactions: Transaction[] = [];
    parsedCategories.forEach((category: Category) => {
      const categoryTransactions = localStorage.getItem(`transactions_${category.id}`);
      if (categoryTransactions) {
        const parsed = JSON.parse(categoryTransactions);
        allTransactions.push(...parsed);
      }
    });

    // Sort by date (most recent first)
    setTransactions(
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  // Category functions
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim()
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
      setNewCategoryName('');
      setSelectedCategory(newCategory);
    }
  };

  const startEditingCategory = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  const saveEditCategory = () => {
    if (editingCategory && editCategoryName.trim()) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory ? { ...cat, name: editCategoryName.trim() } : cat
      );
      setCategories(updatedCategories);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
      
      // Update transactions with new category name
      const categoryTransactions = transactions.filter(t => t.categoryId === editingCategory);
      if (categoryTransactions.length > 0) {
        const updatedTransactions = transactions.map(t =>
          t.categoryId === editingCategory ? { ...t, categoryName: editCategoryName.trim() } : t
        );
        setTransactions(updatedTransactions);
        localStorage.setItem(`transactions_${editingCategory}`, 
          JSON.stringify(categoryTransactions.map(t => ({ ...t, categoryName: editCategoryName.trim() })))
        );
      }
      
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const deleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
    localStorage.removeItem(`transactions_${categoryId}`);
    setTransactions(transactions.filter(t => t.categoryId !== categoryId));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
    }
  };

  // Transaction functions
  const addTransaction = () => {
    if (selectedCategory && newTransaction.amount && newTransaction.description) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description.trim(),
        type: newTransaction.type,
        date: new Date().toISOString(),
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name
      };

      // Update transactions state
      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);

      // Update localStorage
      const categoryTransactions = updatedTransactions.filter(t => t.categoryId === selectedCategory.id);
      localStorage.setItem(`transactions_${selectedCategory.id}`, JSON.stringify(categoryTransactions));

      // Reset form
      setNewTransaction({
        amount: '',
        description: '',
        type: 'income'
      });
    }
  };

  const deleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      
      const categoryTransactions = updatedTransactions.filter(t => t.categoryId === transaction.categoryId);
      localStorage.setItem(`transactions_${transaction.categoryId}`, JSON.stringify(categoryTransactions));
    }
  };

  // Calculate balances
  const totalBalance = transactions.reduce(
    (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
    0
  );

  const categoryBalances = categories.reduce((acc, category) => {
    const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
    const balance = categoryTransactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
    return { ...acc, [category.id]: balance };
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Category and Transaction Management */}
      <div className="md:col-span-1 space-y-4">
        {/* Category Management */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
          
          {/* Add Category */}
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Category
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {categories.map(category => (
              <div
                key={category.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && saveEditCategory()}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-gray-900">{category.name}</span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-2">
                    {editingCategory === category.id ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEditCategory();
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={(e) => startEditingCategory(category, e)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => deleteCategory(category.id, e)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Management */}
        {selectedCategory && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Add Transaction - {selectedCategory.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'outcome' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="outcome">Outcome</option>
                </select>
              </div>
              <button
                onClick={addTransaction}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Overview */}
      <div className="md:col-span-2 space-y-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Total Balance</h2>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>

        {/* Category Balances */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Category Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className={`text-lg font-medium ${
                  categoryBalances[category.id] >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${categoryBalances[category.id].toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">({transaction.categoryName})</span>
                    </div>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 