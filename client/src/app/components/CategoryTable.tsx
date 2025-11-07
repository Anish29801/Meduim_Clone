'use client';

import { useState } from 'react';
import { Category } from '../type';

interface Props {
  categories: Category[];
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  page: number;
  limit: number;
}

export default function CategoryTable({
  page,
  limit,
  categories,
  onUpdate,
  onDelete,
}: Props) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  //edit
  const HandleEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  //save
  const handleSave = () => {
    if (editId && editName.trim()) {
      onUpdate(editId, editName.trim());
      setEditId(null);
      setEditName('');
    }
  };
  const goback = () => {};

  return (
    <table className="w-full border border-gray-300 rounded-lg text-sm text-left">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th className="px-6 py-3 font-semibold border-b">Serial no</th>
          <th className="px-6 py-3 font-semibold border-b">Name</th>
          <th className="px-cat.id6 py-3 font-semibold border-b text-center">
            Articles
          </th>
          <th className="px-6 py-3 font-semibold border-b text-center">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((cat, index) => (
          <tr
            key={cat.id}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="px-6 py-3 border-b">
              {(page - 1) * limit + index + 1}
            </td>
            <td className="px-6 py-3 border-b">
              {editId === cat.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded-md px-2 py-1 w-full"
                />
              ) : (
                cat.name
              )}
            </td>

            <td className="px-6 py-3 border-b text-center">
              {cat._count?.articles || 0}
            </td>

            <td className="px-6 py-3 border-b text-center">
              <div className="flex justify-center gap-2">
                {editId === cat.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg shadow-md transition duration-200 ease-in-out"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => HandleEdit(cat)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-lg shadow-md transition duration-200 ease-in-out"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={async () => {
                    try {
                      await onDelete(cat.id);
                    } catch (error) {}
                  }}
                  disabled={cat._count?.articles! > 0}
                  className={`${
                    cat._count?.articles! > 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-semibold px-3 py-1 rounded-lg shadow-md transition duration-200 ease-in-out`}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
