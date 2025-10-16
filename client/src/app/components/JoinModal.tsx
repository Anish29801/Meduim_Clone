'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '@/app/login/Login';
import SignUp from '@/app/signup/SignUp';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 w-full max-w-md">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 text-2xl font-bold transition-colors"
              >
                &times;
              </button>

              {/* Modal Title */}
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {isLogin ? 'Login' : 'Create Account'}
              </h2>

              {/* Form */}
              {isLogin ? <Login /> : <SignUp />}

              {/* Toggle */}
              <p className="text-sm text-center mt-4 text-gray-600">
                {isLogin ? (
                  <>
                    Don’t have an account?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-indigo-500 font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-indigo-500 font-medium"
                    >
                      Login
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
