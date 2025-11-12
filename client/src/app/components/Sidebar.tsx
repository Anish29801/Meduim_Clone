'use client';

import {
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FolderCog } from 'lucide-react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const { user, isLoggedIn } = useAuth();

  const userNavigation = [
    {
      name: 'Home',
      icon: HomeIcon,
      href: '/home',
      current: true,
      private: false,
    },
    {
      name: 'Library',
      icon: BookOpenIcon,
      href: '/dashboard',
      current: false,
      private: true,
    },
    {
      name: 'Profile',
      icon: UserIcon,
      href: '/update',
      current: false,
      private: true,
    },
    {
      name: 'Stories',
      icon: NewspaperIcon,
      href: '/stories',
      current: false,
      private: true,
    },
    // { name: "Stats", icon: ChartBarIcon, href: "#", current: false },
  ];

  const adminNavigation = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      href: '/admin/dashboard',
      private: false,
    },
    {
      name: 'Manage Articles',
      icon: ShieldCheckIcon,
      href: '/admin/articles',
      private: false,
    },
    {
      name: 'Manage Categories',
      icon: FolderCog,
      href: '/categories',
      private: false,
    },
    {
      name: 'Articles',
      icon: NewspaperIcon,
      href: '/dashboard',
      current: false,
      private: true,
    },
    // { name: "Settings", icon: Cog6ToothIcon, href: "", private: false },
  ];

  // Pick menu based on role
  const navigations = user?.role === 'ADMIN' ? adminNavigation : userNavigation;

  return (
    <>
      <aside
        className={classNames(
          'max-h-screen top-0 left-0  w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40'
        )}
      >
        <div className="h-full p-5 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 font-serif">
            {user?.role === 'ADMIN' ? 'Admin Panel' : 'User Dashboard'}
          </h2>

          <nav className="space-y-1">
            {navigations.map(
              (item) =>
                (!item.private || isLoggedIn) && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      'text-gray-800 hover:bg-gray-50 hover:text-black',
                      'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'
                    )}
                  >
                    <item.icon className="h-5 w-5 text-gray-500 group-hover:text-black" />
                    {item.name}
                  </Link>
                )
            )}
          </nav>

          {user?.role === 'USER' && (
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
    </>
  );
}
