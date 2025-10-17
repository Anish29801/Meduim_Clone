'use client';

import { useState } from 'react';
import Image from 'next/image';
import JoinModal from '../components/JoinModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-white">
      {/* ✅ Navigation */}
      <nav className="relative w-full border-b border-black h-[60px] flex-shrink-0">
        <div className="max-w-[1192px] mx-auto flex justify-between items-center h-full px-6 md:px-10 pb-1">
          {/* Left logo */}
          <div className="text-4xl md:text-4xl font-bold font-serif text-black">
            Tagebuch
          </div>

          {/* Right links */}
          <div className="flex items-center gap-8 md:gap-12 text-gray-900 font-medium tracking-wide uppercase text-sm md:text-base">
            {['Our story', 'Membership', 'Write', 'Sign in'].map((link) => (
              <a
                key={link}
                href="#"
                className="relative group px-1 md:px-2 transition-all duration-300"
              >
                {link}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            {/* Modern Gradient Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-50 rounded-full transition duration-300 blur-sm"></span>
              <span className="absolute left-[-70%] top-0 w-1/2 h-full bg-white opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 rounded-full"></span>
              <span className="relative z-10">Get started</span>
            </button>

            <JoinModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      </nav>

      {/* ✅ Hero Section */}
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

      {/* ✅ Footer */}
      <footer className="border-t border-black bg-white py-4 flex-shrink-0 w-full">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 px-4">
          {[
            'Help',
            'Status',
            'About',
            'Careers',
            'Press',
            'Blog',
            'Privacy',
            'Rules',
            'Terms',
            'Text to speech',
          ].map((item) => (
            <a key={item} href="#" className="hover:text-black transition">
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
