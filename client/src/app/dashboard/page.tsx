'use client';

import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useApi } from "../hooks/useApi";

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
}

interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  userName: string;
}

interface CommentForm {
  [postId: number]: string;
}

export default function Dashboard() {
  const { callApi, loading, error } = useApi<Post[]>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsData, setCommentsData] = useState<Record<number, Comment[]>>({});
  const [commentText, setCommentText] = useState<CommentForm>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const articles = await callApi("/api/articles");

        const mappedPosts: Post[] = articles.map((a: any) => ({
          id: a.id,
          title: a.title,
          publication: `Category ${a.categoryId}`,
          views: a.views || 0,
          comments: 0, // will fetch separately
          daysAgo: Math.floor((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          description: a.content?.slice(0, 120) + "...",
          image: a.coverImage,
          content: a.content,
          authorId: a.authorId,
          tags: a.tags,
        }));

        setPosts(mappedPosts);

        // Fetch comments per post
        for (const post of mappedPosts) {
          const postComments = await callApi(`/api/comments?articleId=${post.id}`);
          setCommentsData(prev => ({ ...prev, [post.id]: postComments }));
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: postComments.length } : p));
        }

      } catch (err) {
        console.error("Failed to fetch posts or comments", err);
      }
    };

    fetchPosts();
  }, [callApi]);

  const handleCommentChange = (postId: number, value: string) => {
    setCommentText(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId: number) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const user = userData ? JSON.parse(userData) : { id: 1, name: "Anonymous" };

    try {
      const newComment = await callApi("/api/comments", {
        method: "POST",
        data: { content: text, articleId: postId, userId: user.id },
      });

      setCommentsData(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { ...newComment, userName: user.name }],
      }));
      setCommentText(prev => ({ ...prev, [postId]: "" }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading posts...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">For you</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border-b pb-4">
            <PostCard post={post} />

            {/* Display existing comments */}
            <div className="mt-2">
              {commentsData[post.id]?.map(c => (
                <div key={c.id} className="mb-2 text-sm border-l-2 border-gray-200 pl-2">
                  <strong>{c.userName}</strong>: {c.content}
                </div>
              ))}
            </div>

            {/* Comment box */}
            <div className="mt-4">
              <textarea
                value={commentText[post.id] || ""}
                onChange={e => handleCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-md mb-2"
                rows={2}
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Post Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
