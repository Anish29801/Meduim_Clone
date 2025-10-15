'use client';

import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import male from '@/../public/male.svg';

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo + Search */}
              <div className="flex items-center space-x-6">
                <span className="font-serif text-xl font-semibold text-gray-900">
                  Tagebuch
                </span>
                <div className="hidden md:flex relative">
                  <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-8 pr-3 py-1.5 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center space-x-4">
                <button className="hidden sm:flex items-center text-sm font-medium text-gray-700 border rounded-full px-3 py-1.5 hover:bg-gray-100">
                  <PencilSquareIcon className="h-5 w-5 mr-1" />
                  Write
                </button>
                <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />

                <Menu as="div" className="relative">
                  <MenuButton>
                    <Image
                      src={male}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black/5 focus:outline-none">
                    {['Your profile', 'Settings', 'Sign out'].map((item) => (
                      <MenuItem key={item}>
                        {({ focus }) => (
                          <a
                            href="#"
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              focus ? 'bg-gray-100' : ''
                            }`}
                          >
                            {item}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>

              {/* Mobile button */}
              <Disclosure.Button className="sm:hidden p-2 rounded-md hover:bg-gray-100">
                {open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Disclosure.Button>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
