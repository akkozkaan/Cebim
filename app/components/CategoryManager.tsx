'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  onSelectCategory: (category: Category | null) => void;
}

export default function CategoryManager({ onSelectCategory }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      const updatedCategories = categories.map(cat => 
        cat.id === editingId ? { ...cat, name: editName.trim() } : cat
      );
      setCategories(updatedCategories);
      const updatedCategory = updatedCategories.find(cat => cat.id === editingId);
      if (updatedCategory) {
        onSelectCategory(updatedCategory);
      }
      setEditingId(null);
      setEditName('');
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    onSelectCategory(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={addCategory}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectCategory(category)}
          >
            {editingId === category.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-gray-900 font-medium">{category.name}</span>
            )}
            
            <div className="flex gap-2">
              {editingId === category.id ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveEdit();
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(category);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategory(category.id);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 