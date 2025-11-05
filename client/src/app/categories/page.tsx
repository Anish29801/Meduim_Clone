'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useApi } from '../hooks/useApi';
import { Category, PaginatedResponse } from '../type';
import CategoryTable from '../components/CategoryTable';
import CategoryForm from '../components/CategoryForm';
import AdminLayout from '../admin/layout';

export default function categoryPage() {
  const { data, loading, callApi } = useApi<PaginatedResponse<Category[]>>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  //fetch category
  const fetchCategories = async () => {
    try {
      const res = await callApi(`api/categories?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
      setCategories(res.data);
      setTotalPages(Math.ceil(res.total / res.limit));
    } catch (error) {
      toast.error('failed to load categories');
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [page]);

  //create category
  const handleCreate = async (name: string) => {
    try {
      await callApi('api/categories/create', {
        method: 'POST',
        data: { name },
      });
      toast.success('Category created');
      fetchCategories();
    } catch {}
  };

  //update category
  const handleUpdate = async (id: number, name: string) => {
    try {
      await callApi(`/api/categories/${id}`, { method: 'PUT', data: { name } });
      toast.success('Category updated');
      fetchCategories();
    } catch {}
  };

  //delete category
  const handleDelete = async (id: number) => {
    try {
      await callApi(`/api/categories/${id}`, { method: 'delete' });
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {}
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <Toaster position="top-right" />
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <CategoryForm onCreate={handleCreate} />

        {loading ? (
          <p className="text-gray-500 mt-4">Loading...</p>
        ) : (
          <>
            <CategoryTable
              page={page}
              limit={limit}
              categories={categories}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 rounded ${
                      num === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
