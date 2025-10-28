"use client";

import { Banner } from "./components/Banner";
import { Cards } from "./components/Cards";
import { QuotesSection } from "./components/QuotesSection";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <aside className="w-64 fixed top-0 left-0 h-screen border-r border-gray-200 bg-white z-40">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col">
        <div className="px-4 md:px-10">
          <Banner />
          <Cards />
          <QuotesSection />
        </div>
      </main>
    </div>
  );
}
