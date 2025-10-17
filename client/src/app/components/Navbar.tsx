'use client';

import { useState } from 'react';
import JoinModal from './JoinModal';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
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

          {/* Get Started Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-black overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-50 rounded-full transition duration-300 blur-sm"></span>
            <span className="absolute left-[-70%] top-0 w-1/2 h-full bg-white opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 rounded-full"></span>
            <span className="relative z-10">Get started</span>
          </button>

          {/* Modal */}
          <JoinModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}
