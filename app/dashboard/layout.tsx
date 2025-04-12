'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import UserMenu from '../components/UserMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        <header className="bg-white shadow">
          <div className="flex justify-end items-center mx-auto px-4 py-4">
            <UserMenu />
          </div>
        </header>
        <main className="mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
} 