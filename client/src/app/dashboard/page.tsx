"use client";

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useApi } from "../hooks/useApi";
import ClientLayout from "../components/layouts/client-layout";

interface Post {
  id: number;
  title: string;
  publication: string;
  views: number;
  comments: number;
  daysAgo: number;
  description: string;
  image?: string;
  content?: string;
  authorId: number;
  tags: { id: number; name: string }[];
  author?: string;
  authorAvatar?: string;
}

export default function Dashboard() {
  const { callApi, loading, error } = useApi<Post[]>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const articles = await callApi("/api/articles");

        const mappedPosts: Post[] = articles.map((a: any) => ({
          id: a.id,
          title: a.title,
          publication: a.category?.name || `Category ${a.categoryId}`,
          views: a.views || 0,
          comments: 0,
          daysAgo: Math.floor(
            (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          ),
          description: a.content?.slice(0, 120) + "...",
          image: a.coverImage,
          content: a.content,
          authorId: a.authorId,
          tags: a.tags,
          author: a.author?.username,
          authorAvatar: a.author?.avatar || "/default-avatar.png",
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, [callApi]);

  if (loading) return <div className="p-10 text-center">Loading posts...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <ClientLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">For you</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </ClientLayout>
  );
}
