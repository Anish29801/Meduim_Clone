'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarAndFooter = pathname?.startsWith('/write');

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <div className="flex-1 flex flex-col">
        {!hideNavbarAndFooter && <Navbar />}
        <main className="flex-1 p-6">{children}</main>
        {!hideNavbarAndFooter && <Footer />}
      </div>
    </div>
  );
}
