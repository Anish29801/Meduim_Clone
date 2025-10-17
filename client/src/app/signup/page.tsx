'use client';
import { useState } from 'react';
import { SignUpProps } from '../type';


export default function SignUp({ onSubmit }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'male' | 'female' | ''>(
    ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const username = (form.username as HTMLInputElement).value;
    const fullName = (form.fullName as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value;
    const bio = (form.bio as HTMLTextAreaElement).value;
    const gender = (form.gender as HTMLSelectElement).value;
    const role = (form.role as unknown as HTMLSelectElement).value as
      | 'USER'
      | 'ADMIN';

    if (onSubmit)
      onSubmit(
        username,
        fullName,
        email,
        password,
        confirmPassword,
        bio,
        selectedAvatar,
        gender,
        role
      );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Username */}
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        required
      />

      {/* Full Name */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        required
      />

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
      </div>

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Bio"
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
      />

      {/* Avatar Selection */}
      <div>
        <p className="mb-2 font-medium text-gray-700">Choose Avatar</p>
        <div className="flex gap-4">
          {/* Male */}
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'male'
                ? 'border-indigo-500'
                : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('male')}
          >
            <img
              src="/male.svg"
              alt="Male"
              className="w-12 h-12 rounded-full"
            />
          </div>

          {/* Female */}
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === 'female'
                ? 'border-indigo-500'
                : 'border-gray-300'
            }`}
            onClick={() => setSelectedAvatar('female')}
          >
            <img
              src="/female.svg"
              alt="Female"
              className="w-12 h-12 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Gender */}
      <select
        name="gender"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        defaultValue=""
        required
      >
        <option value="" disabled>
          Select Gender
        </option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      {/* Role */}
      <select
        name="role"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
        defaultValue="USER"
        required
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="SUBADMIN">SubAdmin</option>
      </select>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2.5 mt-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all"
      >
        Sign Up
      </button>
    </form>
  );
}