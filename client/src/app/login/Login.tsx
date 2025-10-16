'use client';
import { useState } from 'react';
import Image from 'next/image';

interface LoginProps {
  onSubmit?: (email: string, password: string, confirmPassword: string) => void;
  onGoogleLogin?: () => void;
}

export default function Login({ onSubmit, onGoogleLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value;

    if (onSubmit) onSubmit(email, password, confirmPassword);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        required
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all"
      >
        Login
      </button>

      {/* Divider */}
      <div className="flex items-center my-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full border rounded-full py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
      >
        <Image
          src="/icons8-google-48.png"
          alt="Google"
          width={20}
          height={20}
        />
        <span className="font-medium text-gray-700">Continue with Google</span>
      </button>
    </form>
  );
}
