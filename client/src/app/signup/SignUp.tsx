'use client';
import { useState } from 'react';
import { SignUpProps } from '../type';

export default function SignUp({ onSubmit }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<'male' | 'female' | ''>(
    ''
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.target as HTMLFormElement;

    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;
    const fullName = (form.elements.namedItem('fullName') as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem('confirmPassword') as HTMLInputElement
    ).value;
    const bio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement)
      .value as 'USER' | 'ADMIN';

    const gender =
      selectedAvatar === 'male'
        ? 'Male'
        : selectedAvatar === 'female'
        ? 'Female'
        : '';

    if (!selectedAvatar) {
      setError('Please select an avatar.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      // Call your API here
      const payload = {
        username,
        fullName,
        email,
        password,
        bio,
        gender,
        role,
        avatar: selectedAvatar,
      };

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

      setSuccess('Signup successful! 🎉');
      form.reset();
      setSelectedAvatar('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Full Name */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        {/* Email */}
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
          className="w-full px-3 py-2 border rounded-lg resize-none"
        />

        {/* Avatar Selection */}
        <div>
          <p className="mb-2 font-medium text-gray-700">Choose Avatar</p>
          <div className="flex gap-4">
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

        {/* Role */}
        <select
          name="role"
          defaultValue="USER"
          className="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-2 rounded-lg bg-green-500 text-white"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
