"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    id: 1,
    text: "The art of writing is the art of discovering what you believe.",
    author: "Gustave Flaubert",
  },
  {
    id: 2,
    text: "You can make anything by writing.",
    author: "C.S. Lewis",
  },
  {
    id: 3,
    text: "Start writing, no matter what. The water does not flow until the faucet is turned on.",
    author: "Louis L’Amour",
  },
  {
    id: 4,
    text: "Fill your paper with the breathings of your heart.",
    author: "William Wordsworth",
  },
];

export function QuotesSection() {
  return (
    <section className="px-8 md:px-16 py-20 bg-gray-50">
      <motion.h2
        className="text-4xl md:text-5xl font-serif text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Words to Inspire
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {quotes.map((quote, index) => (
          <motion.div
            key={quote.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-gray-700 italic text-base md:text-lg mb-4">
              “{quote.text}”
            </p>
            <span className="text-gray-500 font-medium text-sm md:text-base">
              — {quote.author}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
