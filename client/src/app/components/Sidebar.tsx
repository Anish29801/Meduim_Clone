"use client";

import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  NewspaperIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", icon: HomeIcon, href: "/", current: true },
  { name: "Library", icon: BookOpenIcon, href: "/dashboard", current: false },
  { name: "Profile", icon: UserIcon, href: "/profile", current: false },
  { name: "Stories", icon: NewspaperIcon, href: "/stories", current: false },
  { name: "Stats", icon: ChartBarIcon, href: "/stats", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      <div className="h-full flex flex-col p-5">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-6 font-serif">
          Dashboard
        </h2>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-800 hover:bg-gray-50 hover:text-black",
                "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
              )}
            >
              <item.icon className="h-5 w-5 text-gray-500 group-hover:text-black" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* Following Section */}
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
      </div>
    </aside>
  );
}
