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
  { name: "Home", icon: HomeIcon, href: "#", current: true },
  { name: "Library", icon: BookOpenIcon, href: "#", current: false },
  { name: "Profile", icon: UserIcon, href: "#", current: false },
  { name: "Stories", icon: NewspaperIcon, href: "#", current: false },
  { name: "Stats", icon: ChartBarIcon, href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-200 bg-white h-screen p-4 flex flex-col">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-50 hover:text-black",
              "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium"
            )}
          >
            <item.icon className="h-5 w-5 text-gray-500 group-hover:text-black" />
            {item.name}
          </a>
        ))}
      </nav>

      {/* Following Section */}
      <div className="mt-6 border-t pt-4">
        <div className="flex items-center gap-x-2 px-3 text-gray-500 text-sm font-semibold">
          <UserGroupIcon className="h-5 w-5" />
          Following
        </div>
        <p className="mt-2 text-sm text-gray-600 px-3">
          Find writers and publications to follow.
        </p>
        <a
          href="#"
          className="px-3 mt-1 inline-block text-sm text-blue-600 hover:underline"
        >
          See suggestions
        </a>
      </div>
    </div>
  );
}
