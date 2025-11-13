'use client';

import React, { useState } from 'react';
import HeadingSearch from '@/app/components/headingSection';
import CategoryTagSidebar from '@/app/components/CategoryTagSidebar';
import ArticleCardsGrid from '@/app/components/ArticleCardsGrid';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <HeadingSearch />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-6 px-4">
        <CategoryTagSidebar />

        <ArticleCardsGrid />
      </div>
    </main>
  );
}
