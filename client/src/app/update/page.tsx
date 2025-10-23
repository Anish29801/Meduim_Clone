"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi";
import { UpdateUserProps, User } from "../type";

export default function UpdateUser({ userId, onUpdate }: UpdateUserProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | "">("");
  const [updateKey, setUpdateKey] = useState("");
  const { callApi, loading } = useApi();

  // ✅ Load user from localStorage or API
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setSelectedAvatar(parsedUser.avatar || "");
    } else if (userId) {
      // fallback: fetch from API if user not found in localStorage
      callApi(`/api/users/${userId}`)
        .then((data) => {
          setUser(data);
          setSelectedAvatar(data.avatar || "");
        })
        .catch(() => toast.error("Failed to load user data ❌"));
    }
  }, [userId, callApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("No user found. Please log in again.");

    try {
      const updatedUser = await callApi(`/api/users/${user.id}`, {
        method: "PUT",
        data: {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          bio: user.bio,
          gender: user.gender,
          avatar: selectedAvatar,
          role: user.role || "USER",
          updateKey: updateKey.trim() || undefined,
        },
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully ✅");

      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed ❌");
    }
  };

  // ✅ Show skeleton loader instead of text
  if (!user) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Avatar selection */}
      <div>
        <p className="text-sm text-gray-600 mb-1">Choose Avatar:</p>
        <div className="flex gap-4">
          {["male", "female"].map((type) => (
            <div
              key={type}
              className={`cursor-pointer p-1 border rounded-full ${
                selectedAvatar === type ? "border-indigo-500" : "border-gray-300"
              }`}
              onClick={() => {
                setSelectedAvatar(type as "male" | "female");
                setUser({ ...user, gender: type, avatar: type });
              }}
            >
              <img src={`/${type}.svg`} alt={type} className="w-12 h-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Optional update key */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="updateKey"
          placeholder="Enter update key (optional)"
          value={updateKey}
          onChange={(e) => setUpdateKey(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
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
        className="w-full py-2.5 mt-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}
