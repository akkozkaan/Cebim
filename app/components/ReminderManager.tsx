'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  description: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'yearly';
}

const STORAGE_KEY = 'payment_reminders';

export default function ReminderManager() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    }
  }, [reminders]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setDueDate('');
    setDescription('');
    setIsRecurring(false);
    setFrequency('monthly');
    setEditingId(null);
  };

  const addReminder = () => {
    if (title && amount && dueDate) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: title.trim(),
        amount: parseFloat(amount),
        dueDate,
        description: description.trim(),
        isRecurring,
        ...(isRecurring && { frequency }),
      };
      setReminders([...reminders, newReminder]);
      resetForm();
    }
  };

  const startEditing = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setAmount(reminder.amount.toString());
    setDueDate(reminder.dueDate);
    setDescription(reminder.description);
    setIsRecurring(reminder.isRecurring);
    if (reminder.frequency) {
      setFrequency(reminder.frequency);
    }
  };

  const saveEdit = () => {
    if (editingId && title && amount && dueDate) {
      setReminders(reminders.map(reminder =>
        reminder.id === editingId
          ? {
              ...reminder,
              title: title.trim(),
              amount: parseFloat(amount),
              dueDate,
              description: description.trim(),
              isRecurring,
              ...(isRecurring && { frequency }),
            }
          : reminder
      ));
      resetForm();
    }
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  // Sort reminders by due date
  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingId ? 'Hatırlatıcıyı Düzenle' : 'Yeni Hatırlatıcı Ekle'}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Başlık
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Kira Ödemesi"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Miktar
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Hatırlatıcı Tarihi
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Bu ayın kira ödemesi"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                Tekrar eden ödeme
              </label>
            </div>
            
            {isRecurring && (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'monthly' | 'yearly')}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="monthly">Aylık</option>
                <option value="yearly">Yıllık</option>
              </select>
            )}
          </div>

          <div className="flex justify-end">
            {editingId ? (
              <div className="flex gap-2">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal et
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            ) : (
              <button
                onClick={addReminder}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ekle
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme Hatırlatıcıları</h3>
          <div className="space-y-4">
            {sortedReminders.length > 0 ? (
              sortedReminders.map(reminder => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                      <span className="text-sm font-medium text-blue-600">
                        ${reminder.amount.toFixed(2)}
                      </span>
                      {reminder.isRecurring && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {reminder.frequency}
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      Son tarih: {new Date(reminder.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(reminder)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                Henüz ödeme hatırlatıcınız yok. Yeni bir hatırlatıcı ekleyin.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 