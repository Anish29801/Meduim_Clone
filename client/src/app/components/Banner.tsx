'use client';

import Image from 'next/image';

export default function Banner() {
  return (
    <section className="flex-1 flex flex-col lg:flex-row justify-between items-center px-8 md:px-16 py-6 md:py-12">
      <div className="max-w-xl mb-8 lg:mb-0 flex flex-col justify-center text-center lg:text-left space-y-6 lg:space-y-8">
        <div className="flex flex-col justify-center items-center h-full lg:items-start">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
             font-serif tracking-tight leading-tight 
             text-center lg:text-left"
          >
            Human
            <br />
            stories & ideas
          </h1>
        </div>

        <p className="text-base md:text-lg lg:text-xl text-gray-700 font-sans whitespace-nowrap overflow-hidden">
          A place to read, write, and deepen your understanding
        </p>

        <div className="flex justify-center lg:justify-start">
          <button
            className="bg-black text-white px-4 py-1.5 rounded-full text-sm md:text-base font-semibold shadow-lg
                  hover:shadow-xl hover:scale-105 hover:bg-gray-900 
                  transition-all duration-300 relative overflow-hidden animate-pulse-slow"
          >
            <span className="relative z-10">Start reading</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"></span>
          </button>
        </div>
      </div>

      {/* ✅ Right image */}
      <div className="relative w-full lg:w-[25%] h-[300px] md:h-[400px] flex-shrink-0 lg:absolute lg:right-0 lg:top-0 lg:h-full">
        <Image
          src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
          alt="Medium Illustration"
          fill
          className="object-contain object-right"
          priority
        />
      </div>
    </section>
  );
}
