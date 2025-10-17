'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LoginProps } from '../type';
import { useApi } from '../hooks/useApi';

export default function Login({ onSubmit }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, error, loading, callApi } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await callApi("http://localhost:5000/api/users/login", {
        method: "POST",
        data: { email, password },
      });

      toast.success("Login successful! 🎉");
      console.log("Response:", response);

      if (onSubmit) onSubmit(email, password, confirmPassword);
    } catch (err: any) {
      toast.error(error || "Login failed. Try again.");
    }
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
          type={showPassword ? "text" : "password"}
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
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
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
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
