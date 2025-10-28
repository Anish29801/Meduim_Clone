'use client';

import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Sirf USER role wale yahan aa sake
  useAuth('USER');

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Removed Navbar and Footer */}
      <main className="flex-1 p-6">{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
