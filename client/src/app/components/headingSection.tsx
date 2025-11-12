'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Article, headingSearchProps } from '../type';
import { useApi } from '@/app/hooks/useApi';

type SearchItem = Article;

const HeadingSearch: React.FC<headingSearchProps> = ({
  heading = 'Discover Great Articles',
  subHeading = 'Read insightful stories from writers around the world',
  placeHolder = 'Search articles...',
  className = '',
}) => {
  const [q, setQ] = useState<string>('');
  const [articles, setArticles] = useState<SearchItem[]>([]);
  const { loading, callApi } = useApi<SearchItem[]>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!q.trim()) return;

    try {
      const endpoint = `/api/articles?title=${encodeURIComponent(q.trim())}`;
      const data = await callApi(endpoint, { method: 'GET' });
      setArticles(data || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="max-w-4xl mx-auto text-center py-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-2">{heading}</h1>
        <p className="text-gray-500 mb-6">{subHeading}</p>

        {/*Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 justify-center"
        >
          <input
            type="search"
            value={q}
            onChange={handleChange}
            placeholder={placeHolder}
            className="w-full sm:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results */}
        <div className="mt-10">
          {loading && <p className="text-gray-500">Loading...</p>}

          {!loading && articles.length === 0 && q && (
            <p className="text-gray-500">No articles found.</p>
          )}

          <div className="grid gap-4 mt-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {article.title}
                </h3>
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {article.content || 'No content available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeadingSearch;
