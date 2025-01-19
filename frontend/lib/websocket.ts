import { Tree } from '../types/tree';

type WebSocketAction = 'create' | 'update' | 'delete';

interface WebSocketMessage {
  action: WebSocketAction;
  tree?: Tree;
  tree_id?: number;
}

type WebSocketCallback = (data: WebSocketMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private subscribers: WebSocketCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      this.subscribers.forEach(callback => callback(data));
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectTimeout * Math.pow(2, this.reconnectAttempts));
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(callback: WebSocketCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers = [];
    this.reconnectAttempts = 0;
  }
}

export const wsClient = new WebSocketClient(); 