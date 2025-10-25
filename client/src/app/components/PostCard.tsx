"use client";

import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  const avatarSrc =
    post?.authorAvatar && post.authorAvatar.trim() !== ""
      ? post.authorAvatar
      : "/default-avatar.png"; // fallback image in /public folder

  const authorAlt = post?.author || "Unknown Author";

  return (
    <Link
      href={`/dashboard/${post.id}`}
      className="block border-b border-gray-200 pb-5 hover:bg-gray-50 transition-colors rounded-lg p-3 cursor-pointer"
    >
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Image
          src={avatarSrc}
          alt={authorAlt}
          width={24}
          height={24}
          className="rounded-full object-cover"
        />
        <span>
          In <strong>{post.publication || "Untitled Publication"}</strong> by{" "}
          {post.author || "Unknown"}
        </span>
      </div>

      <h2 className="text-lg font-semibold mb-1 hover:underline">
        {post.title || "Untitled Post"}
      </h2>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {post.description || "No description available."}
      </p>

      <div className="flex items-center text-gray-500 text-xs gap-3">
        <span>{post.daysAgo ? `${post.daysAgo}d ago` : "Recently"}</span>
        <span>👁 {post.views ?? 0}</span>
        <span>💬 {post.comments ?? 0}</span>
      </div>
    </Link>
  );
}
