'use client';

import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import '@/app/globals.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import React from 'react';

function AdminGuard({ children }: { children: React.ReactNode }) {
  useAuth('ADMIN');
  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuth("ADMIN");

  return (
    <html lang="en" className="h-full">
      <body className={`antialiased h-full bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <Navbar />
          <div className="flex  min-h-screen bg-gray-50 text-gray-900">
            <Sidebar />
            {/* Removed Navbar and Footer */}
            <main className="flex-1 p-6">
              <AdminGuard>{children}</AdminGuard>
            </main>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}
