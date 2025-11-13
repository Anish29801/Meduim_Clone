'use client';

import React, { useEffect, useState } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { Loader2 } from 'lucide-react';

interface CategoryTagSidebarProps {
  onSelectCategory?: (category: string) => void;
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
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const { callApi } = useApi<any>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catResponse, tagResponse] = await Promise.all([
          callApi('/api/categories', { method: 'GET' }),
          callApi('/api/tags', { method: 'GET' }),
        ]);

        console.log('Categories Response:', catResponse);
        console.log('Tags Response:', tagResponse);

        // Extract and normalize data safely
        const categoryList: Category[] = Array.isArray(catResponse?.data)
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

  // if (loading)
  //   return (
  //     <aside className="w-full sm:w-1/4 border border-gray-200 rounded-lg p-4 flex items-center justify-center text-gray-500">
  //       <Loader2 className="animate-spin mr-2" size={18} />
  //       Loading...
  //     </aside>
  //   );

  return (
    <aside className="w-full sm:w-1.5xl  border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Categories</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory(cat.name)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Tags</h3>
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">No tags available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-sm border rounded-full bg-gray-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition"
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
