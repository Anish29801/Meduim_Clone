"use client";

import { useState, useEffect } from "react";
import {
  Disclosure,
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation";
import male from "@/../public/male.svg";
import female from "@/../public/female.svg";
import Sidebar from "./Sidebar";
import SignUp from "../signup/page";
import Login from "../login/page";
import UpdateUser from "../update/page";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined" && userData !== "null") {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserAvatar(user.avatar);
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  }, []);

  const getAvatarImage = () => (userAvatar === "female" ? female : male);

  return (
    <>
      {/* Fixed Sidebar */}
      <Sidebar />

      <Disclosure as="nav" className="bg-white border-b border-gray-200 ml-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start">
              <a href="/" className="flex items-center space-x-2">
                <span className="font-serif text-xl font-semibold text-gray-900">
                  Tagebuch
                </span>
              </a>

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
                    View
                  </button>
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>

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
                      {["Your profile", "Settings", "Sign out"].map((item) => (
                        <MenuItem key={item}>
                          {({ focus }) => (
                            <button
                              type="button"
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                              onClick={() => {
                                if (item === "Your profile") setShowUpdate(true);
                                if (item === "Sign out") {
                                  setIsLoggedIn(false);
                                  localStorage.removeItem("user");
                                  router.push("/");
                                }
                              }}
                            >
                              {item}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
}
