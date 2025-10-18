'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../hooks/useApi';
import { SignUpProps } from '../type';

export default function SignUp({ onSubmit }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'male' | 'female' | ''>('');
  const { callApi, loading } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const bio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value as 'USER' | 'ADMIN';

    const gender = selectedAvatar === 'male' ? 'Male' : selectedAvatar === 'female' ? 'Female' : '';

    if (!selectedAvatar) return toast.error('Please select an avatar.');
    if (password !== confirmPassword) return toast.error('Passwords do not match.');

    try {
      const res = await callApi('http://localhost:5000/api/users/signup', {
        method: 'POST',
        data: { username, fullName, email, password, bio, gender, role, avatar: selectedAvatar },
      });

      // ✅ Save user data in localStorage
      if (res?.data) {
        const { token, user } = res.data; // adjust if your API returns differently
        localStorage.setItem('user', JSON.stringify(user));
        if (token) localStorage.setItem('token', token);
      }

      toast.success('Signup successful! 🎉');

      if (onSubmit)
        onSubmit(username, fullName, email, password, confirmPassword, bio, selectedAvatar, gender, role);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded-lg"
        required
      />

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg"
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
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Bio"
        rows={3}
        className="w-full px-3 py-2 border rounded-lg"
      />

      {/* Avatar Selection */}
      <div>
        <p>Choose Avatar:</p>
        <div className="flex gap-4">
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'male' ? 'border-indigo-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('male')}
          >
            <img src="/male.svg" alt="Male" className="w-12 h-12 rounded-full" />
          </div>
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'female' ? 'border-indigo-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('female')}
          >
            <img src="/female.svg" alt="Female" className="w-12 h-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Role */}
      <select name="role" defaultValue="USER" className="w-full px-3 py-2 border rounded-lg" required>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 mt-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}
