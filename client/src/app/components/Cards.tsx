"use client";

import { motion } from "framer-motion";
import { FaPenNib, FaLightbulb, FaUsers } from "react-icons/fa";

const cards = [
  {
    id: 1,
    title: "Write Your Thoughts",
    description:
      "Express your ideas and share your unique perspective with the world through engaging articles.",
    icon: <FaPenNib className="text-5xl text-[#35ab45]" />,
  },
  {
    id: 2,
    title: "Inspire & Learn",
    description:
      "Discover new insights, learn from others, and let creativity spark your next big idea.",
    icon: <FaLightbulb className="text-5xl text-[#35ab45]" />,
  },
  {
    id: 3,
    title: "Join the Community",
    description:
      "Connect with passionate writers, readers, and thinkers who love sharing ideas and stories.",
    icon: <FaUsers className="text-5xl text-[#35ab45]" />,
  },
];

export function Cards() {
  return (
    <section className="px-8 md:px-16 py-16 bg-white">
      <motion.h2
        className="text-4xl md:text-5xl font-serif text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Explore the World of Writing
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="bg-gray-50 border border-gray-200 shadow-sm rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <motion.div
              className="mb-6"
              initial={{ rotate: -10, opacity: 0 }}
              whileInView={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
              viewport={{ once: true }}
            >
              {card.icon}
            </motion.div>
            <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
