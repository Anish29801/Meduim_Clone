"use client";

import { Banner } from "./components/Banner";
import { Cards } from "./components/Cards";
import { QuotesSection } from "./components/QuotesSection";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar handles its own <aside> */}
      <Sidebar />

      {/* Main Content */}
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
