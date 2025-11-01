"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useApi } from "@/app/hooks/useApi";
import { Article } from "@/app/type";
import toast from "react-hot-toast";

export default function StoriesPage() {
  const { callApi } = useApi();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserArticles = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          toast.error("User not found. Please log in.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser?.id) {
          toast.error("Invalid user data.");
          return;
        }

        const { data, error } = await callApi(`/api/articles/author/${parsedUser.id}`);

        if (error) {
          toast.error("Failed to load articles.");
          console.error("[StoriesPage] API Error:", error);
          return;
        }

        setArticles(data || []);
      } catch (err) {
        console.error("[StoriesPage] Fetch Error:", err);
        toast.error("Something went wrong while fetching articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserArticles();
  }, [callApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading your stories...
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No stories found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Stories</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const coverSrc =
            article.coverImageBase64 || article.coverImage || "/default-cover.jpg";

          const createdDate = article.createdAt
            ? new Date(article.createdAt).toLocaleDateString()
            : "Unknown date";

          return (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={coverSrc}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Published on {createdDate}
                </p>
                <p className="text-gray-700 line-clamp-3">{article.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
