'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TransactionManager from './TransactionManager';

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

interface CategoryManagerProps {
  onSelectCategory: (category: Category | null) => void;
}

const CATEGORIES_STORAGE_KEY = 'income_categories';

export default function CategoryManager({ onSelectCategory }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Load categories and transactions
  const loadData = () => {
    if (typeof window !== 'undefined') {
      // Load categories
      const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      const parsedCategories = savedCategories ? JSON.parse(savedCategories) : [];
      setCategories(parsedCategories);

      // Load all transactions for all categories
      const allTransactions: Transaction[] = [];
      parsedCategories.forEach((category: Category) => {
        const categoryTransactions = localStorage.getItem(`transactions_${category.id}`);
        if (categoryTransactions) {
          const parsed = JSON.parse(categoryTransactions);
          allTransactions.push(...parsed.map((t: Omit<Transaction, 'categoryId' | 'categoryName'>) => ({
            ...t,
            categoryId: category.id,
            categoryName: category.name
          })));
        }
      });

      // Sort transactions by date (most recent first)
      setTransactions(
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    }
  };

  // Initial load and setup event listeners
  useEffect(() => {
    loadData();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    // Add custom event listener for transaction updates
    window.addEventListener('transactionUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionUpdated', handleStorageChange);
    };
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      loadData(); // Reload all data when categories change
    }
  }, [categories]);

  // Calculate total balance
  const totalBalance = transactions.reduce(
    (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
    0
  );

  // Calculate balances per category
  const categoryBalances = categories.reduce((acc, category) => {
    const categoryTransactions = transactions.filter(t => t.categoryId === category.id);
    const balance = categoryTransactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
    return { ...acc, [category.id]: balance };
  }, {} as Record<string, number>);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      // Select the new category
      setSelectedCategoryId(newCategory.id);
      onSelectCategory(newCategory);
    }
  };

  const startEditing = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(category.id);
    setEditName(category.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingId ? { ...cat, name: editName.trim() } : cat
      );
      setCategories(updatedCategories);
      setEditingId(null);
      setEditName('');
    }
  };

  const deleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Delete category's transactions from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`transactions_${id}`);
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      onSelectCategory(null);
    }
  };

  const handleTransactionUpdate = () => {
    loadData();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Category Management */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kategori Yönetimi</h3>
          <div className="space-y-4">
            {/* Add Category Input */}
            <div className="space-y-2">
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
                className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Kategori Ekle
              </button>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    onSelectCategory(category);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      {editingId === category.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{category.name}</span>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      {editingId === category.id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveEdit();
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={(e) => startEditing(category, e)}
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
        </div>

        {/* Transaction Manager for Selected Category */}
        {selectedCategoryId && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              İşlem Ekle - {categories.find(c => c.id === selectedCategoryId)?.name}
            </h3>
            <TransactionManager
              key={selectedCategoryId}
              categoryId={selectedCategoryId}
              categoryName={categories.find(c => c.id === selectedCategoryId)?.name || ''}
              onTransactionUpdate={handleTransactionUpdate}
            />
          </div>
        )}
      </div>

      {/* Right Column - Overview */}
      <div className="md:col-span-2 space-y-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-900 mb-2">Toplam Bakiye</h3>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>

        {/* Category Balances Grid */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Kategori Bakiyeleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <div
                key={category.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-medium text-gray-900">{category.name}</h4>
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
          <h3 className="text-xl font-medium text-gray-900 mb-4">Son işlemler</h3>
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
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No transactions yet..</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 