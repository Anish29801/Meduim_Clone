'use client';
import { useParams } from 'next/navigation';
import EditArticlePage from '@/app/articles/EditArticlePage';

export default function EditPage() {
  const { id } = useParams();
  const articleId = Number(id);

  if (!articleId) return <p>Invalid article ID</p>;

  return <EditArticlePage articleId={articleId} />;
}
