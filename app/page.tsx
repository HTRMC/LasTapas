// File: app/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [tableNumber, setTableNumber] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber) {
      router.push(`/menu?table=${tableNumber}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Enter Table Number</h1>
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Table Number"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Go to Menu
        </button>
      </form>
    </div>
  );
}