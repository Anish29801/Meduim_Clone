'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  NewspaperIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface DecodedToken {
  id: number;
  role: string; // "ADMIN" or "USER"
  exp: number;
  iat: number;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [role, setRole] = useState<string>('USER');

  //Read token and extract role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  // Define separate menus
  // const userNavigation = [
  //   { name: 'Home', icon: HomeIcon, href: '/home' },
  //   { name: 'Library', icon: BookOpenIcon, href: '/library' },
  //   { name: 'Profile', icon: UserIcon, href: '/profile' },
  //   { name: 'Stories', icon: NewspaperIcon, href: '/stories' },
  //   { name: 'Stats', icon: ChartBarIcon, href: '/stats' },
  // ];

  // const adminNavigation = [
  //   { name: 'Dashboard', icon: HomeIcon, href: '/admin' },
  //   { name: 'Manage Users', icon: ShieldCheckIcon, href: '/admin/users' },
  //   { name: 'Reports', icon: ChartBarIcon, href: '/admin/reports' },
  //   { name: 'Settings', icon: Cog6ToothIcon, href: '/admin/settings' },
  // ];

  const userNavigation = [
    { name: 'Home', icon: HomeIcon, href: '#', current: true },
    { name: 'Library', icon: BookOpenIcon, href: '/dashboard', current: false },
    { name: 'Profile', icon: UserIcon, href: '#', current: false },
    { name: 'Stories', icon: NewspaperIcon, href: '#', current: false },
    { name: 'Stats', icon: ChartBarIcon, href: '#', current: false },
  ];

  const adminNavigation = [
    { name: 'ArticleDashboard', icon: HomeIcon, href: '/admin/dashboard' },
    { name: 'Library', icon: BookOpenIcon, href: '/dashboard', current: false },
    { name: 'ArticleLists', icon: ShieldCheckIcon, href: '/articles/view' },
    {
      name: 'AdminArticlesPage',
      icon: ShieldCheckIcon,
      href: '/admin/articles',
    },
    { name: 'Reports', icon: ChartBarIcon, href: '' },
    { name: 'Settings', icon: Cog6ToothIcon, href: '' },
  ];

  // Pick menu based on role
  const navigation = role === 'ADMIN' ? adminNavigation : userNavigation;

  return (
    <>
      <aside
        className={classNames(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full p-5 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 font-serif">
            {role === 'ADMIN' ? 'Admin Panel' : 'User Dashboard'}
          </h2>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  'text-gray-800 hover:bg-gray-50 hover:text-black',
                  'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon className="h-5 w-5 text-gray-500 group-hover:text-black" />
                {item.name}
              </a>
            ))}
          </nav>

          {role === 'USER' && (
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center gap-x-2 px-3 text-gray-600 text-sm font-semibold">
                <UserGroupIcon className="h-5 w-5" />
                Following
              </div>
              <p className="mt-2 text-sm text-gray-700 px-3 leading-relaxed">
                Find writers and publications to follow.
              </p>
              <a
                href="#"
                className="px-3 mt-1 inline-block text-sm text-blue-700 hover:underline"
              >
                See suggestions
              </a>
            </div>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30"
        ></div>
      )}
    </>
  );
}
