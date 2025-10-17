'use client';

import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-white">
      <Navbar />
      <Banner />
      <Footer />
    </div>
  );
}
