import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Tree } from '@/types/tree';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { formatDate } from '@/utils/date';

// Fix for default marker icon in react-leaflet
const icon = new Icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapComponentProps {
  trees?: Tree[];
  onMarkerClick?: (tree: Tree) => void;
}

export default function MapComponent({ trees, onMarkerClick }: MapComponentProps) {
  // Default center coordinates (can be adjusted based on your needs)
  const defaultCenter: LatLngExpression = [37.319297067686186, -122.04499463557032];

  // Client-side only rendering for Leaflet
  const [isClient, setIsClient] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('Map component mounted');
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log('Map received trees:', {
      trees,
      isArray: Array.isArray(trees),
      length: trees?.length
    });
  }, [trees]);

  if (!isClient) {
    console.log('Map rendering null (not client)');
    return null;
  }

  if (!trees) {
    console.log('Map rendering null (no trees)');
    return null;
  }

  if (!Array.isArray(trees)) {
    console.error('Trees prop is not an array:', trees);
    return null;
  }

  // Validate each tree object
  const validTrees = trees.filter(tree => {
    const isValid = 
      tree &&
      typeof tree === 'object' &&
      'location' in tree &&
      tree.location &&
      typeof tree.location === 'object' &&
      'lat' in tree.location &&
      'lng' in tree.location &&
      typeof tree.location.lat === 'number' &&
      typeof tree.location.lng === 'number';

    if (!isValid) {
      console.error('Invalid tree object:', tree);
    }
    return isValid;
  });

  console.log('Valid trees for markers:', validTrees);

  if (validTrees.length === 0) {
    console.log('Map rendering empty (no valid trees)');
    return (
      <MapContainer
        center={defaultCenter}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={17}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validTrees.map((tree) => (
        <Marker
          key={tree.id}
          position={[tree.location.lat, tree.location.lng]}
          icon={icon}
          eventHandlers={{
            click: () => onMarkerClick?.(tree)
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold mb-2">{tree.species}</h3>
              <p className="text-sm">Height: {tree.height}m</p>
              <p className="text-sm">Age: {tree.age} years</p>
              <p className="text-sm">Health: {tree.health_condition}</p>
              <p className="text-sm">Last Pruned: {formatDate(tree.last_pruned)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 