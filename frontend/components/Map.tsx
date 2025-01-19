import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import { FC } from 'react';

// Leaflet 기본 아이콘 설정
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface Tree {
  id: number;
  latitude: number;
  longitude: number;
  species: string;
  height: number;
  diameter?: number;
  health_condition?: string;
  planted_date: string;
  notes?: string;
}

interface MapProps {
  trees: Tree[];
}

const Map: FC<MapProps> = ({ trees }) => {
  return (
    <MapContainer
      center={[37.5665, 126.9780]} // 서울 중심 좌표
      zoom={13}
      style={{ height: 'calc(100vh - 100px)', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {trees.map(tree => (
        <Marker
          key={tree.id}
          position={[tree.latitude, tree.longitude]}
        >
          <Popup>
            <div>
              <h3>{tree.species}</h3>
              <p>Height: {tree.height}m</p>
              {tree.diameter && <p>Diameter: {tree.diameter}m</p>}
              {tree.health_condition && <p>Health: {tree.health_condition}</p>}
              <p>Planted: {format(new Date(tree.planted_date), 'yyyy-MM-dd')}</p>
              {tree.notes && <p>Notes: {tree.notes}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map; 