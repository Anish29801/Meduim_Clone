"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface UpdateUserProps {
  onSuccess?: () => void;
}

export default function UpdateUser({ onSuccess }: UpdateUserProps) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    avatar: "male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // ✅ Save to localStorage so Navbar can read updated avatar
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Profile updated successfully!");
        if (onSuccess) onSuccess(); // ✅ Trigger Navbar refresh callback
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-gray-400 focus:border-gray-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-gray-400 focus:border-gray-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar</label>
        <select
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-gray-400 focus:border-gray-400"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
      >
        Save Changes
      </button>
    </form>
  );
}
