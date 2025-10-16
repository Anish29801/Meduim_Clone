"use client";
import { Banner } from "./components/Banner";
import { Cards } from "./components/Cards";
import { QuotesSection } from "./components/QuotesSection";



export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
    <Banner />
    <Cards />
    <QuotesSection />
    </main>
  );
}
