"use client";

import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import { Toaster } from "react-hot-toast";
import "@/app/globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // ✅ Sirf ADMIN role wale yahan aa sake
  useAuth("ADMIN");

  return (
    <html lang="en" className="h-full">
      <body className={`antialiased h-full bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <Navbar />
          <div className="flex  min-h-screen bg-gray-50 text-gray-900">
            <Sidebar />
            {/* Removed Navbar and Footer */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
