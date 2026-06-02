'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Small Groups', href: '/small-groups' },
  { name: 'Paths', href: '/paths' },
  { name: 'Ministries', href: '/ministries' },
  { name: 'Events', href: '/events' },
  { name: 'Finance', href: '/finance' },
];

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className="min-h-screen w-64 border-r border-gray-200 bg-white">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">SaaS Church</h1>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`mb-1 flex items-center rounded-lg px-3 py-2 transition ${
                    isActive
                      ? 'bg-blue-50 font-medium text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
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
