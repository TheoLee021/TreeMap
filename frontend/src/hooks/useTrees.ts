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
        const locationData = JSON.parse(item.location);
        return {
          ...item,
          location: {
            lat: locationData.coordinates[1],
            lng: locationData.coordinates[0]
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
        typeof item.species === 'string' &&
        typeof item.height === 'number' &&
        typeof item.health_condition === 'string' &&
        typeof item.location === 'object' &&
        item.location !== null &&
        typeof item.location.lat === 'number' &&
        typeof item.location.lng === 'number';

      if (!isValid) {
        console.error('Invalid tree object:', item);
      }
      return isValid;
    });

    console.log('Validated trees:', validTrees);
    return validTrees;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Error:', {
        name: error.name,
        message: error.message,
        response: (error as any).response
      });
    } else {
      console.error('Unknown API Error:', error);
    }
    return []; // Return empty array instead of throwing
  }
};

export function useTrees() {
  const { data, error, isLoading, mutate } = useSWR<Tree[]>('/trees', fetcher, {
    onSuccess: (data) => console.log('SWR Success:', data),
    onError: (error) => console.error('SWR Error:', error),
    fallbackData: [] // Provide fallback data
  });

  console.log('useTrees hook state:', {
    data,
    error,
    isLoading
  });

  // Ensure we always return an array, even if data is undefined
  const trees = Array.isArray(data) ? data : [];
  
  return {
    trees,
    isLoading,
    isError: error,
    mutate
  };
} 