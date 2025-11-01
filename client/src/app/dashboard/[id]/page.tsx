"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApi } from "@/app/hooks/useApi";
import { Article } from "@/app/type";
import { useAuth } from "@/app/context/AuthContext"; // ✅ Import Auth Context
import male from "@/app/avatar/male.svg";
import female from "@/app/avatar/female.svg";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

type Comment = {
  id: number;
  content: string;
  userName: string;
  createdAt: string;
};

export default function PostPage({ params }: PostPageProps) {
  const { id } = use(params);
  const { callApi, loading, error } = useApi();
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<{ fullName: string; avatar: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  // ✅ Get user login state
  const { user, isLoggedIn } = useAuth();

  // 🟢 Fetch article, author & comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await callApi(`/api/articles/${id}`);
        setArticle(result);

        const authorInfo = await callApi(`/api/users/info/${result.authorId}`);
        setAuthor(authorInfo);

        const commentList = await callApi(`/api/comments?articleId=${id}`);
        setComments(commentList);
      } catch (err) {
        console.error("Failed to fetch article or comments:", err);
      }
    };

    fetchData();
  }, [id, callApi]);

  // 🟢 Handle post comment (save to DB)
  const handlePostComment = async () => {
    if (!comment.trim() || !user) return;

    try {
      const newComment = await callApi(`/api/comments`, {
        method: "POST",
        data: {
          content: comment,
          articleId: Number(id),
          userId: user.id, // ✅ Use actual logged-in user ID
        },
      });
      setComments((prev) => [...prev, newComment]);
      setComment("");
    } catch (err) {
      console.error("❌ Failed to post comment:", err);
    }
  };

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

      <article className="prose prose-gray max-w-none text-gray-800 mb-10">
        <p>
          <span dangerouslySetInnerHTML={{ __html: article.content }}></span>
        </p>
      </article>

      {/* 🟨 Comments Section */}
      <section className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold mb-3">Leave a Comment</h2>

        {/* ✅ Disable textarea & button when logged out */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            isLoggedIn ? "Write your comment..." : "Login to post a comment"
          }
          disabled={!isLoggedIn}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none ${
            !isLoggedIn ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
          }`}
          rows={3}
        />

        <button
          onClick={handlePostComment}
          disabled={!isLoggedIn || !comment.trim()}
          className={`mt-3 px-5 py-2 rounded-lg text-white transition-colors ${
            isLoggedIn
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoggedIn ? "Post Comment" : "Login to Comment"}
        </button>

        {/* 🟩 Display Comments */}
        {comments.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium text-gray-700">Comments:</h3>
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-gray-100 rounded-lg text-gray-800 border border-gray-200"
              >
                <p>{c.content}</p>
                <small className="text-gray-500 text-xs">
                  by {c.userName} · {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
