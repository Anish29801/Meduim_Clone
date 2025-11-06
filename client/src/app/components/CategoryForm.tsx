'use client';

import { useState } from 'react';

interface Props {
  onCreate: (name: string) => void;
}

export default function categoryForm({ onCreate }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 mb-6 bg-gray-100 p-3 rounded-lg"
    >
      <input
        type="text"
        placeholder="Enter category name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}
