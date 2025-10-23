import Image from "next/image";
import Link from "next/link";

const posts = [
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
    image: "/images/post1.jpg",
    content: (
      <>
        <p className="mb-4">
          The past year has seen record temperatures and sea level rise. In
          2023, at least 12,000 people died from climate-fueled disasters
          worldwide, and the US alone saw $81 billion in damages.
        </p>
        <p className="mb-4">
          There’s no denying the magnitude and the danger climate change is
          already posing to the world today — and it’s going to get worse unless
          we act now.
        </p>
        <p>
          As UX designers, we might not be engineers or scientists, but we shape
          billions of interactions that can guide sustainable user behavior.
          Designing with environmental consciousness is both a moral and
          business imperative.
        </p>
      </>
    ),
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
    image: "/images/post2.jpg",
    content: (
      <p>
        AI-assisted coding tools are changing how we approach software creation.
        But they also introduce new challenges in understanding and ownership of
        code.
      </p>
    ),
  },
];

export default function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = posts.find((p) => p.id === Number(params.id));

  if (!post) {
    return <div className="p-10 text-center text-gray-500">Post not found.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Image
          src={post.authorAvatar}
          alt={post.author}
          width={30}
          height={30}
          className="rounded-full"
        />
        <span>
          In <strong>{post.publication}</strong> by {post.author} ·{" "}
          {post.daysAgo}d ago
        </span>
      </div>

      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-lg mb-6"
        />
      )}

      <article className="prose prose-gray max-w-none text-gray-800">
        {post.content}
      </article>
    </main>
  );
}
