export interface Tree {
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