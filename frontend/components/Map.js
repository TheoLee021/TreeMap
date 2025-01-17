import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';

// Leaflet 기본 아이콘 설정
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

export default function Map({ trees }) {
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
              <p>Diameter: {tree.diameter}m</p>
              <p>Health: {tree.health_condition}</p>
              <p>Planted: {format(new Date(tree.planted_date), 'yyyy-MM-dd')}</p>
              {tree.notes && <p>Notes: {tree.notes}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 