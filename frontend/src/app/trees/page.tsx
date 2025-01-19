'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useTrees } from '@/hooks/useTrees';
import { formatDate } from '@/utils/date';

export default function TreesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { trees, isLoading, isError, mutate } = useTrees(sortBy, sortOrder);

  const filteredTrees = trees.filter(tree => 
    tree.botanical_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.tag_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    mutate();
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-1 container mx-auto px-4 py-8">
          <p className="text-red-500">Error loading trees data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Trees List</h1>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search trees..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="p-4">
                <p className="text-gray-500">Loading trees data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        onClick={() => handleSort('tag_number')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Tag # {renderSortIcon('tag_number')}
                      </th>
                      <th 
                        onClick={() => handleSort('botanical_name')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Botanical Name {renderSortIcon('botanical_name')}
                      </th>
                      <th 
                        onClick={() => handleSort('common_name')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Common Name {renderSortIcon('common_name')}
                      </th>
                      <th 
                        onClick={() => handleSort('height')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Height (m) {renderSortIcon('height')}
                      </th>
                      <th 
                        onClick={() => handleSort('diameter')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Diameter (cm) {renderSortIcon('diameter')}
                      </th>
                      <th 
                        onClick={() => handleSort('crown_height')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Crown Height (m) {renderSortIcon('crown_height')}
                      </th>
                      <th 
                        onClick={() => handleSort('crown_spread')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Crown Spread (m) {renderSortIcon('crown_spread')}
                      </th>
                      <th 
                        onClick={() => handleSort('contributors')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Contributors {renderSortIcon('contributors')}
                      </th>
                      <th 
                        onClick={() => handleSort('last_update')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Last Update {renderSortIcon('last_update')}
                      </th>
                      <th 
                        onClick={() => handleSort('last_inspection')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Last Inspection {renderSortIcon('last_inspection')}
                      </th>
                      <th 
                        onClick={() => handleSort('health')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        Health {renderSortIcon('health')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expert Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTrees.map((tree) => (
                      <tr key={tree.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tree.tag_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tree.botanical_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tree.common_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.height ? tree.height.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.diameter ? tree.diameter.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.crown_height ? tree.crown_height.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.crown_spread ? tree.crown_spread.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tree.contributors || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.last_update ? formatDate(tree.last_update) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tree.last_inspection ? formatDate(tree.last_inspection) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tree.health || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{tree.notes || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{tree.expert_notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 