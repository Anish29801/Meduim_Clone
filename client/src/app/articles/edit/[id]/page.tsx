'use client';
import { useParams } from 'next/navigation';
import EditArticlePage from '@/app/articles/EditArticlePage';

export default function EditPage() {
  const { id } = useParams(); // URL se id milti hai, e.g. /articles/edit/9

  return <EditArticlePage articleId={Number(id)} />;
}
