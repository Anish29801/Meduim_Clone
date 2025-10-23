"use client";

import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="border-b border-gray-200 pb-5 hover:bg-gray-50 transition-colors rounded-lg p-3 cursor-pointer">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Image
          src={post.authorAvatar}
          alt={post.author}
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>
          In <strong>{post.publication}</strong> by {post.author}
        </span>
      </div>

      <h2 className="text-lg font-semibold mb-1 hover:underline">
        {post.title}
      </h2>

      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
        {post.description}
      </p>

      <div className="flex items-center text-gray-500 text-xs gap-3">
        <span>{post.daysAgo}d ago</span>
        <span>👁 {post.views}</span>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  );
}
