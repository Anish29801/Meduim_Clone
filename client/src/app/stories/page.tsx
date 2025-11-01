"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { useAuth } from "@/app/context/AuthContext";
import PostCard from "@/app/components/PostCard";

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

export default function StoriesPage() {
  const { user } = useAuth();
  const { callApi, loading, error } = useApi<Post[]>();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserArticles = async () => {
      try {
        // ✅ Fetch user-specific articles
        const articles = await callApi(`/api/articles/author/${user.id}`);

        const mappedPosts: Post[] = articles.map((a: any) => ({
          id: a.id,
          title: a.title,
          publication: a.category?.name || `Category ${a.categoryId}`,
          views: a.views || 0,
          comments: a.comments?.length || 0,
          daysAgo: Math.floor(
            (Date.now() - new Date(a.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          description: a.content?.slice(0, 120) + "...",
          image: a.coverImage
            ? `http://localhost:5000/api/articles/${a.id}/cover`
            : "/default-cover.jpg",
          content: a.content,
          authorId: a.authorId,
          tags: a.tags || [],
          author: a.author?.username,
          authorAvatar: a.author?.avatar || "/default-avatar.png",
        }));

        setPosts(mappedPosts);
      } catch (err) {
        console.error("❌ Failed to fetch user articles:", err);
      }
    };

    fetchUserArticles();
  }, [user, callApi]);

  // UI States
  if (!user?.id)
    return (
      <div className="p-10 text-center text-gray-500">
        Please log in to view your stories.
      </div>
    );

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load stories: {error}
      </div>
    );

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {user.username}'s Stories
      </h1>

      {posts.length === 0 ? (
        <div className="text-gray-500 text-center">
          You haven’t written any stories yet.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
