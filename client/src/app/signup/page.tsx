'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../hooks/useApi';
import { SignUpProps } from '../type';

export default function SignUp({ onSubmit }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'male' | 'female' | ''>('');
  const { callApi, loading } = useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value.trim();
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value.trim();
    const bio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value.trim();
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value as 'USER' | 'ADMIN';
    const gender = selectedAvatar === 'male' ? 'Male' : selectedAvatar === 'female' ? 'Female' : '';

    if (!selectedAvatar) {
      toast.error('Please select an avatar.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      // ✅ Use endpoint only — baseURL handled by useApi (http://localhost:8000)
      const res = await callApi('/api/users/signup', {
        method: 'POST',
        data: { username, fullName, email, password, bio, gender, role, avatar: selectedAvatar },
      });

      // ✅ Store user & token if available
      if (res?.token) localStorage.setItem('token', res.token);
      if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));

      toast.success('Signup successful! 🎉');

      if (onSubmit)
        onSubmit(username, fullName, email, password, confirmPassword, bio, selectedAvatar, gender, role);
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.response?.data?.message || 'Signup failed ❌');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        required
      />

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        required
      />

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

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Bio"
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
      />

      {/* Avatar */}
      <div>
        <p className="font-medium text-gray-700 mb-1">Choose Avatar:</p>
        <div className="flex gap-4">
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'male' ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('male')}
          >
            <img src="/male.svg" alt="Male" className="w-12 h-12 rounded-full" />
          </div>
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'female' ? 'border-green-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('female')}
          >
            <img src="/female.svg" alt="Female" className="w-12 h-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Role */}
      <select
        name="role"
        defaultValue="USER"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
        required
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-70"
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}
