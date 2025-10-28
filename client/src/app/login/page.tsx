'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LoginProps } from '../type';
import { useApi } from '../hooks/useApi';

export default function Login({ onSubmit }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { error, loading, callApi } = useApi();
  const router = useRouter(); // ✅ router for redirect

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value.trim();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match ❌');
      return;
    }

    try {
      // ✅ Only endpoint — baseURL comes from useApi()
      const response = await callApi('/api/users/login', {
        method: 'POST',
        data: { email, password },
      });

      // ✅ Save user and token to localStorage
      if (response?.token) localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      toast.success('Login successful 🎉');

      // Optional callback
      if (onSubmit) onSubmit(email, password, confirmPassword);

      // ✅ Redirect to /dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(error || 'Login failed. Try again ❌');
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        required
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
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
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
