"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi";
import { UpdateUserProps, User } from "../type";

export default function UpdateUser({ userId, onUpdate }: UpdateUserProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | "">("");
  const [confirmKey, setConfirmKey] = useState("");
  const { callApi, loading } = useApi();

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setSelectedAvatar(parsedUser.avatar === "male" ? "male" : "female");
    }
  }, []);

  // ✅ Update user profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("No user found. Please log in again.");

    if (confirmKey.trim() !== "root") {
      return toast.error("Invalid confirmation password ❌");
    }

    try {
      const updatedUser = await callApi(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        data: {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          bio: user.bio,
          gender: user.gender,
          role: user.role || "USER",
          avatar: selectedAvatar,
          updatePassword: confirmKey,
        },
      });

      // ✅ Refresh localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("User updated successfully ✅");

      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed.");
    }
  };

  // If no user data
  if (!user) return <p>Loading user info...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-700">Update Profile</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        className="w-full px-3 py-2 border rounded-lg"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        required
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        className="w-full px-3 py-2 border rounded-lg"
        value={user.fullName}
        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-2 border rounded-lg"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        required
      />
      <textarea
        name="bio"
        placeholder="Bio"
        rows={3}
        className="w-full px-3 py-2 border rounded-lg"
        value={user.bio || ""}
        onChange={(e) => setUser({ ...user, bio: e.target.value })}
      />

      <div>
        <p>Choose Avatar:</p>
        <div className="flex gap-4">
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === "male" ? "border-indigo-500" : "border-gray-300"
            }`}
            onClick={() => {
              setSelectedAvatar("male");
              setUser({ ...user, gender: "Male", avatar: "male" });
            }}
          >
            <img src="/male.svg" alt="Male" className="w-12 h-12 rounded-full" />
          </div>
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === "female" ? "border-indigo-500" : "border-gray-300"
            }`}
            onClick={() => {
              setSelectedAvatar("female");
              setUser({ ...user, gender: "Female", avatar: "female" });
            }}
          >
            <img src="/female.svg" alt="Female" className="w-12 h-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Confirmation password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="confirmKey"
          placeholder="Enter confirmation password"
          value={confirmKey}
          onChange={(e) => setConfirmKey(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 mt-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
