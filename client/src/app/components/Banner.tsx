"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Banner() {
  return (
    <section className="flex flex-col lg:flex-row justify-between items-center px-8 md:px-16 py-12 md:py-20 relative overflow-hidden">
      {/* ✅ Left Content with motion */}
      <motion.div
        className="max-w-xl mb-12 lg:mb-0 flex flex-col justify-center text-center lg:text-left space-y-6 lg:space-y-8 z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif tracking-tight leading-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Human
          <br />
          stories & ideas
        </motion.h1>

        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-700 font-sans"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          A place to read, write, and deepen your understanding
        </motion.p>

        <motion.div
          className="flex justify-center lg:justify-start gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Start Reading Button */}
          <motion.button
            whileHover={{
              scale: 1.07,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="bg-black text-white px-6 py-2 rounded-full text-sm md:text-base font-semibold relative overflow-hidden"
          >
            <span className="relative z-10">Start reading</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"></span>
          </motion.button>

          {/* Start Writing Button */}
          <motion.button
            whileHover={{
              scale: 1.07,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="bg-white text-black px-6 py-2 rounded-full text-sm md:text-base font-semibold border border-black relative overflow-hidden"
          >
            <span className="relative z-10">Start writing</span>
            <span className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/20 to-black/10 opacity-0 hover:opacity-20 rounded-full transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>

      </motion.div>

      {/* ✅ Animated Right Image */}
      <motion.div
        className="relative w-full lg:w-[30%] h-[300px] md:h-[400px] lg:h-[500px]"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Image
          src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
          alt="Illustration representing human stories and ideas"
          fill
          className="object-contain object-center lg:object-right"
          priority
        />
      </motion.div>
    </section>
  );
}
