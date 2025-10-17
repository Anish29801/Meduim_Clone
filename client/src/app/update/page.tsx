"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi";

interface UpdateUserProps {
  userId: string;
  onUpdate?: () => void;
}

export default function UpdateUser({ userId, onUpdate }: UpdateUserProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<"male" | "female" | "">("");
  const [confirmKey, setConfirmKey] = useState("");
  const { callApi, loading } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const bio = (form.elements.namedItem("bio") as HTMLTextAreaElement).value;
    const role = "USER"; // fixed role
    const gender = selectedAvatar === "male" ? "Male" : selectedAvatar === "female" ? "Female" : "";

    if (!selectedAvatar) return toast.error("Please select an avatar.");
    if (confirmKey.trim() !== "root") return toast.error("Invalid confirmation password ❌");

    try {
      await callApi(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        data: { username, fullName, email, bio, gender, role, avatar: selectedAvatar },
      });

      toast.success("User updated successfully ✅");
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-700">Update Profile</h2>

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
      <textarea
        name="bio"
        placeholder="Bio"
        rows={3}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <div>
        <p>Choose Avatar:</p>
        <div className="flex gap-4">
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === "male" ? "border-indigo-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedAvatar("male")}
          >
            <img src="/male.svg" alt="Male" className="w-12 h-12 rounded-full" />
          </div>
          <div
            className={`cursor-pointer p-1 border rounded-full ${
              selectedAvatar === "female" ? "border-indigo-500" : "border-gray-300"
            }`}
            onClick={() => setSelectedAvatar("female")}
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
