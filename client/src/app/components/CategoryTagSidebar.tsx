'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';

interface CategoryTagSidebarProps {
  onSelectCategory?: (categoryId: number | 'All') => void;
  onSelectTag?: (tagId: number) => void;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const CategoryTagSidebar: React.FC<CategoryTagSidebarProps> = ({
  onSelectCategory = () => {},
  onSelectTag = () => {},
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState<boolean>(false);

  const VISIBLE_COUNT = 5;

  const visibleCategories = showMore
    ? categories
    : categories.slice(0, VISIBLE_COUNT);

  const { callApi } = useApi<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catResponse, tagResponse] = await Promise.all([
          callApi('/api/categories', { method: 'GET' }),
          callApi('/api/tags', { method: 'GET' }),
        ]);
        console.log('CATEGORY API RAW:', catResponse);
        console.log('TAG API RAW:', tagResponse);

        const categoryList: Category[] = Array.isArray(catResponse)
          ? catResponse
          : Array.isArray(catResponse?.data)
            ? catResponse.data
            : [];

        const tagList: Tag[] = Array.isArray(tagResponse)
          ? tagResponse
          : Array.isArray(tagResponse?.data)
            ? tagResponse.data
            : [];

        setCategories(categoryList);
        setTags(tagList);
      } catch (err) {
        console.error('Error fetching categories/tags:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [callApi]);

  return (
    <aside className="w-full sm:w-64 border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col overflow-visible -translate-x-22">
      {/* Categories Section */}
      <div className="mb-4 flex-1 overflow-visible">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Categories</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {/* All option */}
            <li key="all">
              <button
                onClick={() => onSelectCategory('All')}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition font-semibold"
              >
                All
              </button>
            </li>

            {/* Actual categories */}
            {visibleCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {cat.name}
                </button>
              </li>
            ))}

            {/* More / Show Less Button */}
            {categories.length > VISIBLE_COUNT && (
              <li>
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  className="w-full text-left px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50 transition font-medium"
                >
                  {showMore ? 'Show Less' : 'More...'}
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Tags Section */}
      <div className="flex-1 overflow-visible">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Tags</h3>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                onClick={() => onSelectTag(tag.id)}
                className="px-3 py-1 text-sm border rounded-full bg-gray-50 text-gray-700 
             hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default CategoryTagSidebar;
