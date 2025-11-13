'use client';

import React, { useEffect } from 'react';
import { Article, Post } from '@/app/type';
import { useApi } from '@/app/hooks/useApi';

type ResourceType = 'articles' | 'posts';
type Resource = Article | Post;

interface ArticleCardsGridProps {
  type?: ResourceType;
  query?: string;
}

const ArticleCardsGrid: React.FC<ArticleCardsGridProps> = ({
  type = 'articles',
  query = '',
}) => {
  const { data, loading, error, callApi } = useApi<Resource[]>();

  useEffect(() => {
    let endpoint = `/api/${type}`;
    if (query?.trim()) {
      endpoint += `?title=${encodeURIComponent(query.trim())}`;
    }
    callApi(endpoint, { method: 'GET' });
  }, [callApi, type, query]);

  if (loading) return <p className="text-center mt-10">Loading {type}...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data || data.length === 0)
    return <p className="text-center mt-10">No {type} found.</p>;

  return (
    <section className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
      {data.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
        >
          {/* Conditional Image Handling */}
          {'coverImageBase64' in item && item.coverImageBase64 ? (
            <img
              src={`data:image/jpeg;base64,${item.coverImageBase64}`}
              alt={item.title}
              className="w-full h-40 object-cover"
            />
          ) : 'image' in item && item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover"
            />
          ) : null}

          {/* Content Section */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>

            {/* Description */}
            {'content' in item ? (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.content.slice(0, 100)}...
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {'tags' in item && item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Author + Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
              {'author' in item ? (
                typeof item.author === 'object' ? (
                  <span>{item.author.name}</span>
                ) : (
                  <span>{item.author}</span>
                )
              ) : null}

              {'createdAt' in item && item.createdAt ? (
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              ) : 'daysAgo' in item ? (
                <span>{item.daysAgo} days ago</span>
              ) : null}
            </div>

            {/* Views & Comments */}
            {'views' in item && (
              <div className="flex gap-3 text-xs text-gray-400 mt-2">
                <span>👁 {item.views}</span>
                <span>💬 {item.comments}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ArticleCardsGrid;
