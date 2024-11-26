// File: app/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const MIN_TABLE = 1;
  const MAX_TABLE = 50;

  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableNumber(value);
    
    // Clear error when input is empty
    if (!value) {
      setError('');
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
    } else if (numValue < MIN_TABLE) {
      setError(`Table number must be at least ${MIN_TABLE}`);
    } else if (numValue > MAX_TABLE) {
      setError(`Table number cannot exceed ${MAX_TABLE}`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numValue = parseInt(tableNumber);
    if (!tableNumber || isNaN(numValue)) {
      setError('Please enter a valid table number');
      return;
    }
    
    if (numValue < MIN_TABLE || numValue > MAX_TABLE) {
      setError(`Please enter a table number between ${MIN_TABLE} and ${MAX_TABLE}`);
      return;
    }

    router.push(`/menu?table=${numValue}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Enter Table Number</h1>
        <input
          id="tableNumber"
          type="number"
          value={tableNumber}
          onChange={handleTableNumberChange}
          className="w-full p-2 border rounded mb-4 ${error ? 'border-red-500' : 'border-gray-300'}"
          placeholder={`Enter table number (${MIN_TABLE}-${MAX_TABLE})`}
          min={MIN_TABLE}
          max={MAX_TABLE}
          required
        />
        {error && (
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          )}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Go to Menu
        </button>
      </form>
    </div>
  );
}