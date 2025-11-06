'use client';

import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import '@/app/globals.css';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

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
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 p-6">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
    </>
  );
}
