'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'í³Š' },
  { name: 'Members', href: '/members', icon: 'í±¥' },
  { name: 'Small Groups', href: '/small-groups', icon: 'í¿ ' },
  { name: 'Paths', href: '/paths', icon: 'í»¤ï¸' },
  { name: 'Ministries', href: '/ministries', icon: 'â›ª' },
  { name: 'Events', href: '/events', icon: 'í³…' },
  { name: 'Finance', href: '/finance', icon: 'í²°' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">SaaS Church</h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <nav className="px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
