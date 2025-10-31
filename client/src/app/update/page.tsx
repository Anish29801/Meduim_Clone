"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi";
import { UpdateUserProps, User } from "../type";
import { useAuth } from "../context/AuthContext";

export default function UpdateUser({ userId, onUpdate }: UpdateUserProps) {
  const { callApi, loading } = useApi();
  const { user, updateUser } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | "">("");

  useEffect(() => {
    if (user) {
      setLocalUser(user);
      setSelectedAvatar(user.avatar || "");
    } else {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        setLocalUser(parsedUser);
        setSelectedAvatar(parsedUser.avatar || "");
      } else if (userId) {
        callApi(`/api/users/${userId}`)
          .then((data) => {
            setLocalUser(data);
            setSelectedAvatar(data.avatar || "");
          })
          .catch(() => toast.error("Failed to load user data ❌"));
      }
    }
  }, [user, userId, callApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localUser) return toast.error("No user found. Please log in again.");

    try {
      const payload = {
        fullName: localUser.fullName,
        bio: localUser.bio,
        role: localUser.role || "USER",
        avatar: selectedAvatar,
        gender: selectedAvatar === "male" ? "Male" : "Female",
        updatePassword: "root",
      };

      const updatedUser = await callApi(`/api/users/${localUser.id}`, {
        method: "PUT",
        data: payload,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      updateUser(updatedUser);

      toast.success("Profile updated successfully ✅");
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed ❌");
    }
  };

  if (!localUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-3 w-1/2">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-4 sm:px-0">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={localUser.username}
              onChange={(e) => setLocalUser({ ...localUser, username: e.target.value })}
              required
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={localUser.fullName}
              onChange={(e) => setLocalUser({ ...localUser, fullName: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              disabled
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              value={localUser.email}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
              value={localUser.bio || ""}
              onChange={(e) => setLocalUser({ ...localUser, bio: e.target.value })}
            />
          </div>

          {/* Avatar */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Avatar</p>
            <div className="flex items-center gap-6">
              {["male", "female"].map((type) => (
                <div
                  key={type}
                  className={`cursor-pointer rounded-full p-1 border-4 transition-all ${
                    selectedAvatar === type
                      ? "border-green-500 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedAvatar(type as "male" | "female");
                    setLocalUser({ ...localUser, gender: type, avatar: type });
                  }}
                >
                  <img
                    src={`/${type}.svg`}
                    alt={type}
                    className="w-14 h-14 rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
