'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { headingSearchProps } from '../type';
import { Search } from 'lucide-react';

let debounceTimer: NodeJS.Timeout;

const HeadingSearch: React.FC<headingSearchProps> = ({
  heading = 'Discover Great Articles',
  subHeading = 'Read insightful stories from writers around the world',
  placeHolder = 'Search articles...',
  onSearch = () => {},
  className = '',
}) => {
  const [q, setQ] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQ(value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  return (
    <section className="text-center py-10">
      <div className="text-start px-75 py-4">
        <h1 className="text-4xl font-bold mb-2 ">{heading}</h1>
        <p className="text-gray-500 mb-6">{subHeading}</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-full sm:max-w-2/3">
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          {/* Input Field */}
          <input
            type="search"
            value={q}
            onChange={handleChange}
            placeholder={placeHolder}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeadingSearch;
