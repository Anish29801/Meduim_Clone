"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ClientLayout from "../components/layouts/client-layout";

interface Article {
  id: number;
  title: string;
  content: string;
  coverImageBase64?: string | null;
  author?: { name: string };
  category?: { name: string };
  tags?: { id: number; name: string }[];
}

// 🧩 Utility: Extract readable text from Lexical JSON
function extractPlainText(lexicalJSON: string): string {
  try {
    const parsed = JSON.parse(lexicalJSON);
    const root = parsed.root;
    if (!root?.children) return "";

    return root.children
      .map((p: any) => (p.children || []).map((child: any) => child.text || "").join(" "))
      .join("\n")
      .trim();
  } catch {
    // Fallback if content is not JSON
    return lexicalJSON.slice(0, 200);
  }
}

export default function ArticlePage() {
  const { callApi, loading } = useApi<Article[]>();
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  // 🔹 Fetch all articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await callApi("/api/articles");
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    }
    fetchArticles();
  }, [callApi]);

  // 🔹 Navigate to edit page
  const handleEdit = (id: number) => {
    router.push(`/articles/edit/${id}`);
  };

  // 🔹 Delete article
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await callApi(`/api/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete article");
    }
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">📰 All Articles</h1>

        {articles.length === 0 ? (
          <p className="text-gray-500 text-center">No articles found.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {articles.map((a) => (
              <div
                key={a.id}
                className="flex flex-col md:flex-row-reverse bg-white border-2 border-gray-200 shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-400 transition duration-300"
              >
                {/* 🖼️ Cover Image */}
                {a.coverImageBase64 && (
                  <img
                    src={a.coverImageBase64}
                    alt={a.title}
                    className="w-full md:w-1/3 h-48 object-cover"
                    loading="lazy"
                  />
                )}

                {/* 📝 Article Info */}
                <div className="p-5 md:w-2/3 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">{a.title}</h2>

                  <p className="text-gray-600 line-clamp-3">
                    {extractPlainText(a.content).slice(0, 200)}...
                  </p>

                  {/* 🏷️ Tags */}
                  {a.tags && a.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {a.tags.map((t) => (
                        <span
                          key={t.id}
                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
                        >
                          #{t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 👤 Author & 📂 Category */}
                  <div className="text-sm text-gray-500 mt-3">
                    {a.author?.name && <span>👤 {a.author.name}</span>}
                    {a.category?.name && <span className="ml-4">📂 {a.category.name}</span>}
                  </div>

                  {/* 🔘 Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(a.id)}
                      className="text-sm text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-sm text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
