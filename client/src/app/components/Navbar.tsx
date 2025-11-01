"use client";
import LogoLink from "./LogoLink";

import { useState, useEffect } from "react";
import { Disclosure, Dialog, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import SignUp from "../signup/page";
import Login from "../login/page";
import UpdateUser from "../update/page";
import male from "@/../public/male.svg";
import female from "@/../public/female.svg";
import { useAuth } from "@/app/context/AuthContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const { user, isLoggedIn, logout, updateUser, login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const getAvatarImage = () => (user?.avatar === "female" ? female : male);

  return (
    <>
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start">
              {/* remove admin and user dashboard */}
              {/* Logo */}
              {/* <a href="/" className="flex items-center space-x-2">
                <span className="font-serif text-xl font-semibold text-gray-900">
                  Tagebuch
                </span>
              </a> */}

              <LogoLink />

              {/* Search */}
              <div className="ml-6 hidden md:flex items-center">
                <div className="relative text-gray-500">
                  <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-8 pr-3 py-1.5 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-sm font-medium text-gray-700 border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-sm font-medium text-white bg-gray-900 rounded-full px-3 py-1.5 hover:bg-gray-800"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/articles/new")}
                    className="inline-flex items-center text-sm font-medium text-gray-700 border rounded-full px-3 py-1.5 hover:bg-gray-100 transition"
                  >
                    <PencilSquareIcon className="h-5 w-5 mr-1" />
                    Write
                  </button>
                  <button
                    onClick={() => router.push("/articles/view")}
                    className="inline-flex items-center text-sm font-medium text-gray-700 border rounded-full px-3 py-1.5 hover:bg-gray-100 transition"
                  >
                    view
                  </button>
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>

                  {/* Profile Menu */}
                  <Menu as="div" className="relative">
                    <MenuButton className="flex rounded-full focus:outline-none">
                      <Image
                        src={getAvatarImage()}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </MenuButton>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>
      </Disclosure>

      {/* LOGIN MODAL */}
      <Dialog open={showLogin} onClose={() => setShowLogin(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <Login
              onSubmit={(email, password) => {
                setShowLogin(false);
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* SIGNUP MODAL */}
      <Dialog open={showSignUp} onClose={() => setShowSignUp(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg relative">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <SignUp onSubmit={() => setShowSignUp(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* UPDATE PROFILE MODAL */}
      <Dialog open={showUpdate} onClose={() => setShowUpdate(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg relative">
            <button
              onClick={() => setShowUpdate(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <UpdateUser onUpdate={() => setShowUpdate(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
