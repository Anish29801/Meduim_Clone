"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  NewspaperIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // Prevent flicker or wrong menu on first render

  const publicNavigation = [
    { name: "Home", icon: HomeIcon, href: "/" },
    { name: "Blog", icon: NewspaperIcon, href: "/dashboard" },
  ];

  const privateNavigation = [
    { name: "Home", icon: HomeIcon, href: "/" },
    { name: "Library", icon: BookOpenIcon, href: "/dashboard" },
    { name: "Profile", icon: UserIcon, href: "/profile" },
    { name: "Stories", icon: NewspaperIcon, href: "/stories" },
    { name: "Stats", icon: ChartBarIcon, href: "/stats" },
  ];

  const navigation = isLoggedIn ? privateNavigation : publicNavigation;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      <div className="h-full p-5 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 font-serif">
          Dashboard
        </h2>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-800 hover:bg-gray-50 hover:text-black",
                  "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                )}
              >
                <item.icon
                  className={classNames(
                    isActive
                      ? "text-black"
                      : "text-gray-500 group-hover:text-black",
                    "h-5 w-5"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {isLoggedIn && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-x-2 px-3 text-gray-600 text-sm font-semibold">
              <UserGroupIcon className="h-5 w-5" />
              Following
            </div>
            <p className="mt-2 text-sm text-gray-700 px-3 leading-relaxed">
              Find writers and publications to follow.
            </p>
            <Link
              href="#"
              className="px-3 mt-1 inline-block text-sm text-blue-700 hover:underline"
            >
              See suggestions
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
