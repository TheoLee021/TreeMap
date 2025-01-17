import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getTrees } from '../lib/api';
import { wsClient } from '../lib/websocket';

// Leaflet은 클라이언트 사이드에서만 로드되어야 함
const Map = dynamic(
  () => import('../components/Map'),
  { 
    ssr: false,
    loading: () => <p>Loading map...</p>
  }
);

export default function Home() {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    // 초기 데이터 로드
    getTrees().then(setTrees).catch(console.error);

    // WebSocket 연결 및 실시간 업데이트
    wsClient.connect();
    const unsubscribe = wsClient.subscribe((data) => {
      if (data.action === 'create') {
        setTrees(prev => [...prev, data.tree]);
      } else if (data.action === 'update') {
        setTrees(prev => prev.map(tree => 
          tree.id === data.tree.id ? data.tree : tree
        ));
      } else if (data.action === 'delete') {
        setTrees(prev => prev.filter(tree => tree.id !== data.tree_id));
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>Tree Map</h1>
      {typeof window !== 'undefined' && <Map trees={trees} />}
      <style jsx>{`
        .container {
          height: 100vh;
          padding: 1rem;
        }
        h1 {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
} 