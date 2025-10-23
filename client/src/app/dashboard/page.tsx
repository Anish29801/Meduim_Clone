"use client";

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

interface Post {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  publication: string;
  views: number;
  comments: number;
  daysAgo: number;
  description: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Simulated dynamic data (replace later with API)
  useEffect(() => {
    const mockData: Post[] = [
      {
        id: 1,
        title: "What a UXer can do about climate change",
        author: "Mike Brzozowski",
        authorAvatar: "/avatars/user1.png",
        publication: "Bootcamp",
        views: 262,
        comments: 5,
        daysAgo: 6,
        description:
          "Using our power to align customer value with sustainable business.",
      },
      {
        id: 2,
        title: "Vibe coding: the antidote",
        author: "Jules May",
        authorAvatar: "/avatars/user2.png",
        publication: "MeetCyber",
        views: 456,
        comments: 32,
        daysAgo: 6,
        description:
          "LLMs have shown themselves to be a terrible way to write programs. But the problem they address is real.",
      },
    ];
    setPosts(mockData);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">For you</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
