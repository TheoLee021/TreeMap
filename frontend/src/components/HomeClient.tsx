'use client';

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MapComponent from './Map';
import { useTrees } from '@/hooks/useTrees';
import type { Tree } from '@/types/tree';

export default function HomeClient() {
  const { trees, isLoading, isError } = useTrees();

  useEffect(() => {
    console.log('HomeClient trees state:', {
      trees,
      isLoading,
      isError
    });
  }, [trees, isLoading, isError]);

  const handleMarkerClick = (tree: Tree) => {
    console.log('Selected tree:', tree);
  };

  if (isError) {
    return (
      <div className="flex flex-col h-screen">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error loading trees data</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading trees data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-1 relative">
        <MapComponent trees={trees} onMarkerClick={handleMarkerClick} />
      </div>
    </div>
  );
} 