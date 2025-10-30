"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  userName: string;
}

export default function PostCard({ post }: { post: any }) {
  const { callApi } = useApi<Comment[]>();
  const [commentCount, setCommentCount] = useState(0);

  const avatarSrc =
    post?.authorAvatar && post.authorAvatar.trim() !== ""
      ? post.authorAvatar.startsWith("http")
        ? post.authorAvatar
        : `/${post.authorAvatar}.svg`
      : "/default-avatar.png";

  const authorAlt = post?.author || "Unknown Author";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await callApi(`/api/comments?articleId=${post.id}`);
        setCommentCount(res.length || 0);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };
    fetchComments();
  }, [post.id, callApi]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      {/* Card Body */}
      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Image
            src={avatarSrc}
            alt={authorAlt}
            width={26}
            height={26}
            className="rounded-full object-cover"
          />
          <span>
            In <strong>{post.publication}</strong> by{" "}
            <span className="font-medium">{post.author}</span>
          </span>
        </div>

        {/* POST TITLE + DESCRIPTION */}
        <Link href={`/dashboard/${post.id}`}>
          <h2 className="text-xl font-semibold mb-1 hover:underline">{post.title}</h2>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            <span dangerouslySetInnerHTML={{ __html: post.content }}></span>
          </p>
        </Link>

        {/* META INFO */}
        <div className="flex items-center text-gray-500 text-xs gap-3">
          <span>{post.daysAgo ? `${post.daysAgo}d ago` : "Recently"}</span>
          <span>👁 {post.views ?? 0}</span>
          <span>💬 {commentCount}</span>
        </div>
      </div>
    </div>
  );
}
