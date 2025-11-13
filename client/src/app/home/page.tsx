'use client';

import React, { useState } from 'react';
import HeadingSearch from '@/app/components/headingSection';
import CategoryTagSidebar from '@/app/components/CategoryTagSidebar';
import ArticleCardsGrid from '@/app/components/ArticleCardsGrid';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <main className="min-h-screen bg-white-50 white:bg-white-900 py-10 px-4">
      {/* Heading and Search */}
      <HeadingSearch onSearch={(query) => setSearchQuery(query)} />
      <div className="max-w-7xl mx-auto mt-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <CategoryTagSidebar />
        </div>

        {/* Articles Grid */}
        <div className="w-full lg:w-3/4 mt-8 lg:mt-0">
          <ArticleCardsGrid query={searchQuery} />
        </div>
      </div>
    </main>
  );
}
