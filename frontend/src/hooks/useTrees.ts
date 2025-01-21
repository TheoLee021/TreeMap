import useSWR from 'swr';
import api from '@/lib/api';
import type { Tree } from '@/types/tree';

const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    console.log('Raw API Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    
    // Validate the response data
    const data = response.data;
    console.log('Response data type:', typeof data);
    console.log('Is Array?', Array.isArray(data));
    
    if (!Array.isArray(data)) {
      console.error('API Response is not an array:', data);
      return [];
    }

    // Validate each tree object
    const validTrees = data.map((item) => {
      try {
        return {
          ...item,
          location: {
            lat: item.latitude,
            lon: item.longitude
          }
        };
      } catch (error) {
        console.error('Failed to parse location data:', error);
        return null;
      }
    }).filter((item): item is Tree => {
      const isValid = 
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'number' &&
        typeof item.tag_number === 'number' &&
        typeof item.common_name === 'string' &&
        typeof item.botanical_name === 'string' &&
        typeof item.latitude === 'number' &&
        typeof item.longitude === 'number' &&
        typeof item.location === 'object' &&
        item.location !== null &&
        typeof item.location.lat === 'number' &&
        typeof item.location.lon === 'number' &&
        (!item.height || typeof item.height === 'number') &&
        (!item.diameter || typeof item.diameter === 'number') &&
        (!item.crown_height || typeof item.crown_height === 'number') &&
        (!item.crown_spread || typeof item.crown_spread === 'number') &&
        (!item.last_update || typeof item.last_update === 'string') &&
        (!item.contributors || typeof item.contributors === 'string') &&
        (!item.notes || typeof item.notes === 'string') &&
        (!item.last_inspection || typeof item.last_inspection === 'string') &&
        (!item.health || typeof item.health === 'string') &&
        (!item.expert_notes || typeof item.expert_notes === 'string');

      if (!isValid) {
        console.error('Invalid tree data:', item);
        // Log specific validation failures for debugging
        if (item) {
          console.error('Validation failures:', {
            id: typeof item.id !== 'number',
            tag_number: typeof item.tag_number !== 'number',
            common_name: typeof item.common_name !== 'string',
            botanical_name: typeof item.botanical_name !== 'string',
            latitude: typeof item.latitude !== 'number',
            longitude: typeof item.longitude !== 'number',
            location: !item.location || typeof item.location !== 'object',
            location_lat: !item.location?.lat || typeof item.location?.lat !== 'number',
            location_lon: !item.location?.lon || typeof item.location?.lon !== 'number'
          });
        }
      }
      return isValid;
    });

    return validTrees;
  } catch (error) {
    console.error('Failed to fetch trees:', error);
    throw error;
  }
};

export function useTrees(sortBy?: string | null, sortOrder: 'asc' | 'desc' = 'asc') {
  const { data, error, isLoading, mutate } = useSWR<Tree[]>(
    sortBy ? `/api/trees?sort_by=${sortBy}&order=${sortOrder}` : '/api/trees',
    fetcher
  );

  return {
    trees: data || [],
    isLoading,
    isError: error,
    mutate
  };
} 