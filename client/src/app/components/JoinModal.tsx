'use client';
import { useEffect } from 'react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-serif text-center mb-6">Join Medium.</h2>
        <div className="flex flex-col gap-3">
          <button className="border rounded-full py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <span>🔵</span> Sign up with Google
          </button>
          <button className="border rounded-full py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <span>🟦</span> Sign up with Facebook
          </button>
          <button className="border rounded-full py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            ✉️ Sign up with email
          </button>
        </div>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{' '}
          <a href="#" className="text-green-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
