'use client';

import React, { useEffect, useMemo } from 'react';
import { Article, Post } from '@/app/type';
import { useApi } from '@/app/hooks/useApi';

type Resource = Article | Post;

interface ArticleCardsGridProps {
  type?: Resource;
  query?: string;
}

const ArticleCardsGrid: React.FC<ArticleCardsGridProps> = ({ query = '' }) => {
  const { data, loading, error, callApi } = useApi<Resource[]>();
  useEffect(() => {
    let endpoint = '/api/articles';
    if (query?.trim()) {
      endpoint += `?title=${encodeURIComponent(query.trim())}`;
    }
    callApi(endpoint, { method: 'GET' });
  }, [query, callApi]);

  if (loading) return <p className="text-center mt-10">Loading articles...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data || data.length === 0)
    return <p className="text-center mt-10">No articles found.</p>;

  return (
    <section className="-translate-x-[120px] grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1 transition-transform duration-300 ">
      {data.map((item) => (
        <div
          key={item.id}
          className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white pt-5 rounded- hover:rounded-xl hover:border-black h-110"
        >
          <div className="relative w-full h-40 rounded-xl overflow-hidden">
            {'coverImageBase64' in item && item.coverImageBase64 ? (
              <img
                src={item.coverImageBase64}
                alt={item.title}
                className="w-full h-40 object-cover pt-3"
              />
            ) : 'image' in item && item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover pt-3"
              />
            ) : null}
          </div>
          {/* Content Section */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold mt-2">{item.title}</h3>

            {/* Description */}
            {'content' in item ? (
              <p
                className="text-sm text-gray-500 mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
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
              {typeof item.author === 'object' && item.author ? (
                <span>
                  {'fullName' in item.author
                    ? item.author.fullName
                    : 'username' in item.author
                      ? item.author.username
                      : 'Unknown Author'}
                </span>
              ) : (
                <span>Unknown Author</span>
              )}
              {'createdAt' in item && item.createdAt ? (
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              ) : (
                <span>—</span>
              )}
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
