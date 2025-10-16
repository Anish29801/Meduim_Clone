'use client';
import { useState } from 'react';

interface SignUpProps {
  onSubmit?: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
}

export default function SignUp({ onSubmit }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fullName = (form.fullName as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value;

    if (onSubmit) onSubmit(fullName, email, password, confirmPassword);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
      >
        Sign Up
      </button>
    </form>
  );
}
