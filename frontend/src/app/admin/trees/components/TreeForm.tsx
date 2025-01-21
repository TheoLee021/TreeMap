'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { mutate } from 'swr';

interface TreeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TreeFormData {
  tag_number: number;
  common_name: string;
  botanical_name: string;
  health: string;
  latitude?: number;
  longitude?: number;
  height?: number;
  diameter?: number;
  crown_height?: number;
  crown_spread?: number;
  notes?: string;
}

export default function TreeForm({ isOpen, onClose }: TreeFormProps) {
  const [formData, setFormData] = useState<TreeFormData>({
    tag_number: 0,
    common_name: '',
    botanical_name: '',
    health: 'good',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/trees/', formData);
      mutate('/trees/'); // Refresh the trees list
      onClose();
    } catch (err) {
      setError('Failed to add tree. Please try again.');
      console.error('Error adding tree:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Tree</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tag Number*
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.tag_number || ''}
                onChange={(e) =>
                  setFormData({ ...formData, tag_number: parseInt(e.target.value) || 0 })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Common Name*
              </label>
              <input
                type="text"
                required
                value={formData.common_name}
                onChange={(e) =>
                  setFormData({ ...formData, common_name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Botanical Name*
              </label>
              <input
                type="text"
                required
                value={formData.botanical_name}
                onChange={(e) =>
                  setFormData({ ...formData, botanical_name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Health Status*
              </label>
              <select
                required
                value={formData.health}
                onChange={(e) =>
                  setFormData({ ...formData, health: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="dead">Dead</option>
              </select>
            </div>

            {/* Optional Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Height (m)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.height || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Diameter (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.diameter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    diameter: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Tree'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 