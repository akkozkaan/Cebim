'use client';

import { useState } from 'react';
import CategoryManager from '@/app/components/CategoryManager';
import TransactionManager from '@/app/components/TransactionManager';

interface Category {
  id: string;
  name: string;
}

export default function IncomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Categories</h2>
        <CategoryManager onSelectCategory={setSelectedCategory} />
      </div>

      {selectedCategory && (
        <TransactionManager
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
        />
      )}
    </div>
  );
} 