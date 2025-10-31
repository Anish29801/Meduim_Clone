"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideLayout =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <AuthProvider>
      {hideLayout ? (
        // 🟢 Keep AuthProvider but skip Sidebar/Navbar
        <main className="min-h-screen flex items-center justify-center">
          {children}
        </main>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
