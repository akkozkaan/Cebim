'use client';

import ReminderManager from '@/app/components/ReminderManager';

export default function RemindersPage() {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ödeme Hatırlatıcıları</h1>
      <ReminderManager />
    </div>
  );
} 