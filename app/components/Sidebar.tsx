'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  WalletIcon, 
  BellIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Income', href: '/dashboard/income', icon: WalletIcon },
  { name: 'Reminders', href: '/dashboard/reminders', icon: BellIcon },
  { name: 'Goal Tracking', href: '/dashboard/goals', icon: ChartBarIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 h-screen fixed left-0">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white text-xl font-semibold">My Dashboard</span>
      </div>
      <nav className="mt-5 flex-1">
        <div className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  group flex items-center px-2 py-2 text-base font-medium rounded-md
                `}
              >
                <item.icon
                  className={`
                    ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}
                    mr-4 flex-shrink-0 h-6 w-6
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 