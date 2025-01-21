'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';

interface Tree {
  id: number;
  tag_number: string;
  common_name: string;
  botanical_name: string;
  health: string;
  last_update: string;
}

export default function TreesManagement() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  const { data, error, isLoading } = useSWR<Tree[]>(
    `/api/trees/?skip=${(page - 1) * pageSize}&limit=${pageSize}`,
    api.get
  );

  if (error) return <div>Failed to load trees</div>;
  if (isLoading) return <div>Loading...</div>;

  const trees = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Trees Management</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          onClick={() => {/* TODO: Implement new tree creation */}}
        >
          Add New Tree
        </button>
      </div>

      {/* Trees Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Common Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Botanical Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trees.map((tree) => (
              <tr key={tree.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tree.tag_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tree.common_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tree.botanical_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tree.health}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(tree.last_update).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    onClick={() => {/* TODO: Implement edit */}}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => {/* TODO: Implement delete */}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end space-x-2">
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 border rounded-md disabled:opacity-50"
          disabled={!trees.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
} 