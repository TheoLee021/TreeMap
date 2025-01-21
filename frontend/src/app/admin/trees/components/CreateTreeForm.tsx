'use client';

import { useState } from 'react';
import { TreeCreate } from '@/types/tree';
import api from '@/lib/api';

interface CreateTreeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateTreeForm({ onSuccess, onCancel }: CreateTreeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TreeCreate>>({
    tag_number: undefined,
    common_name: '',
    botanical_name: '',
    height: undefined,
    diameter: undefined,
    crown_height: undefined,
    crown_spread: undefined,
    contributors: '',
    notes: '',
    health: '',
    expert_notes: '',
    location: {
      lat: 0,
      lon: 0
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post('/api/trees', {
        ...formData,
        tag_number: Number(formData.tag_number),
        latitude: formData.location?.lat,
        longitude: formData.location?.lon,
        height: formData.height ? Number(formData.height) : undefined,
        diameter: formData.diameter ? Number(formData.diameter) : undefined,
        crown_height: formData.crown_height ? Number(formData.crown_height) : undefined,
        crown_spread: formData.crown_spread ? Number(formData.crown_spread) : undefined,
      });
      onSuccess();
    } catch (err) {
      setError('Failed to create tree. Please try again.');
      console.error('Error creating tree:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        [name === 'latitude' ? 'lat' : 'lon']: Number(value)
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tag Number */}
          <div>
            <label htmlFor="tag_number" className="block text-sm font-medium text-gray-700">
              Tag Number *
            </label>
            <input
              type="number"
              id="tag_number"
              name="tag_number"
              required
              value={formData.tag_number || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Common Name */}
          <div>
            <label htmlFor="common_name" className="block text-sm font-medium text-gray-700">
              Common Name
            </label>
            <input
              type="text"
              id="common_name"
              name="common_name"
              value={formData.common_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Botanical Name */}
          <div>
            <label htmlFor="botanical_name" className="block text-sm font-medium text-gray-700">
              Botanical Name *
            </label>
            <input
              type="text"
              id="botanical_name"
              name="botanical_name"
              required
              value={formData.botanical_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude *
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              required
              value={formData.location?.lat || ''}
              onChange={handleLocationChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude *
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              required
              value={formData.location?.lon || ''}
              onChange={handleLocationChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Measurements */}
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (m)
            </label>
            <input
              type="number"
              step="0.1"
              id="height"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="diameter" className="block text-sm font-medium text-gray-700">
              Diameter (cm)
            </label>
            <input
              type="number"
              step="0.1"
              id="diameter"
              name="diameter"
              value={formData.diameter || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="crown_height" className="block text-sm font-medium text-gray-700">
              Crown Height (m)
            </label>
            <input
              type="number"
              step="0.1"
              id="crown_height"
              name="crown_height"
              value={formData.crown_height || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="crown_spread" className="block text-sm font-medium text-gray-700">
              Crown Spread (m)
            </label>
            <input
              type="number"
              step="0.1"
              id="crown_spread"
              name="crown_spread"
              value={formData.crown_spread || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Health and Contributors */}
          <div>
            <label htmlFor="health" className="block text-sm font-medium text-gray-700">
              Health Status
            </label>
            <input
              type="text"
              id="health"
              name="health"
              value={formData.health}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contributors" className="block text-sm font-medium text-gray-700">
              Contributors
            </label>
            <input
              type="text"
              id="contributors"
              name="contributors"
              value={formData.contributors}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Expert Notes */}
        <div>
          <label htmlFor="expert_notes" className="block text-sm font-medium text-gray-700">
            Expert Notes
          </label>
          <textarea
            id="expert_notes"
            name="expert_notes"
            rows={3}
            value={formData.expert_notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Tree'}
        </button>
      </div>
    </form>
  );
} 