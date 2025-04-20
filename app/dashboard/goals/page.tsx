'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'outcome';
  date: string;
  categoryId: string;
  categoryName: string;
}

export default function GoalsPage() {
  const [monthlyGoal, setMonthlyGoal] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    // Load monthly goal from localStorage
    const savedGoal = localStorage.getItem('monthly_goal');
    if (savedGoal) {
      setMonthlyGoal(parseFloat(savedGoal));
    }

    // Calculate current month's balance
    loadCurrentMonthBalance();
  }, []);

  const loadCurrentMonthBalance = () => {
    // Get all transactions from all categories
    const savedCategories = localStorage.getItem('income_categories');
    if (!savedCategories) {
      setCurrentBalance(0);
      return;
    }

    const categories = JSON.parse(savedCategories);
    let monthlyTransactions: Transaction[] = [];

    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Collect all transactions for the current month
    categories.forEach((category: { id: string }) => {
      const categoryTransactions = localStorage.getItem(`transactions_${category.id}`);
      if (categoryTransactions) {
        const transactions: Transaction[] = JSON.parse(categoryTransactions);
        const monthlyOnes = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
        });
        monthlyTransactions = [...monthlyTransactions, ...monthlyOnes];
      }
    });

    // Calculate total balance
    const total = monthlyTransactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
      0
    );
    setCurrentBalance(total);
  };

  const saveGoal = () => {
    if (newGoal && !isNaN(parseFloat(newGoal))) {
      const goal = parseFloat(newGoal);
      setMonthlyGoal(goal);
      localStorage.setItem('monthly_goal', goal.toString());
      setIsEditing(false);
      setNewGoal('');
    }
  };

  const getProgressMessage = () => {
    if (monthlyGoal === null) return '';
    
    const remaining = monthlyGoal - currentBalance;
    
    if (currentBalance >= monthlyGoal) {
      return `🎉 Tebrikler! hedefinizden $${(currentBalance - monthlyGoal).toFixed(2)} daha fazla kazandınız!`;
    } else {
      return `Hedefine ulaşmak için $${remaining.toFixed(2)} daha var. Böyle devam! 💪`;
    }
  };

  const getProgressPercentage = () => {
    if (monthlyGoal === null || monthlyGoal === 0) return 0;
    const percentage = (currentBalance / monthlyGoal) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Hedef Takip</h1>

      {/* Goal Setting Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-900">Aylık Hedef</h2>
          {monthlyGoal !== null && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {isEditing || monthlyGoal === null ? (
          <div className="space-y-2">
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Aylık hedefini gir"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              min="0"
            />
            <button
              onClick={saveGoal}
              className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {monthlyGoal === null ? 'Hedefi kur' : 'Hedefi Güncelle'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-3xl font-bold text-gray-900">
              ${monthlyGoal.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Progress Section */}
      {monthlyGoal !== null && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-medium text-gray-900">Mevcut İlerleme</h2>
          
          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  İlerleme
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {getProgressPercentage().toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${getProgressPercentage()}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
          </div>

          {/* Current Balance */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-2">Mevcut Bakiye</p>
            <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${currentBalance.toFixed(2)}
            </p>
          </div>

          {/* Progress Message */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-lg text-center text-gray-800">
              {getProgressMessage()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
