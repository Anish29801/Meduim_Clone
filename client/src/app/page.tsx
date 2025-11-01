"use client";

import { Banner } from "./components/Banner";
import { Cards } from "./components/Cards";
import ClientLayout from "./components/layouts/client-layout";
import { QuotesSection } from "./components/QuotesSection";

export default function Home() {
  return (
    <ClientLayout>
      <main className="flex-1 ml-64 flex flex-col">
        <div className="px-4 md:px-10">
          <Banner />
          <Cards />
          <QuotesSection />
        </div>
      </main>
    </ClientLayout>
  );
}
