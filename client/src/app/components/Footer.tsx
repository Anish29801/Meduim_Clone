"use client";

import Link from "next/link";

export default function Footer() {
  const links = [
    "Help",
    "Status",
    "About",
    "Careers",
    "Press",
    "Blog",
    "Privacy",
    "Rules",
    "Terms",
    "Text to speech",
  ];

  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-8 w-full mt-auto">
      <div className="container mx-auto flex flex-col items-center space-y-4 px-6">
        {/* ✅ Footer Links */}
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-5 md:gap-6 text-sm md:text-base text-gray-600">
          {links.map((item) => (
            <Link
              key={item}
              href="#"
              className="text-gray-600 no-underline hover:text-black hover:underline underline-offset-4 transition-all duration-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* ✅ Divider */}
        <div className="w-16 border-t border-gray-300 mt-2"></div>

        {/* ✅ Copyright */}
        <p className="text-xs md:text-sm text-gray-500 tracking-wide">
          © {new Date().getFullYear()} <span className="font-medium">Medium Clone</span> — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
