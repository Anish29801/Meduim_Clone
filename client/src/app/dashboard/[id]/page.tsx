"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { Article } from "@/app/type";
import male from "@/app/assets/male.svg"
import female from "@/app/assets/female.svg"

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default function PostPage({ params }: PostPageProps) {
  const { id } = use(params);
  const { callApi, loading, error } = useApi();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<{ fullName: string; avatar: string } | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // ✅ Fetch article using callApi
        const result = await callApi(`/api/articles/${id}`);
        setArticle(result);

        // ✅ Fetch author info using callApi
        const authorInfo = await callApi(`/api/users/info/${result.authorId}`);
        setAuthor(authorInfo);
      } catch (err) {
        console.error("Failed to fetch article or author", err);
      }
    };

    fetchArticle();
  }, [id, callApi]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!article) return <div className="p-10 text-center text-gray-500">Post not found.</div>;

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toDateString()
    : "Unknown date";

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/dashboard" className="text-green-600 hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-2">{article.title}</h1>

      {/* ✅ Author Info */}
      {author && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Image
            src={author.avatar === "male" ? male : female}
            alt={`${author.fullName}'s avatar`}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span>
            By <strong>{author.fullName}</strong> · {formattedDate}
          </span>
        </div>
      )}

      {article.coverImage && (
        <Image
          src={article.coverImage}
          alt={article.title}
          width={800}
          height={400}
          className="rounded-lg mb-6"
        />
      )}

      <article className="prose prose-gray max-w-none text-gray-800">
        <p>{article.content}</p>
      </article>
    </main>
  );
}
