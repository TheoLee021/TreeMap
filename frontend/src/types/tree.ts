export interface TreeLocation {
  lat: number;
  lng: number;
}

export interface Tree {
  id: number;
  species: string;
  height: number;
  age: number;
  health_condition: string;
  last_pruned: string;
  location: TreeLocation;
  created_at: string;
  updated_at: string;
}

export interface TreeCreate {
  species: string;
  height: number;
  age: number;
  health_condition: string;
  last_pruned: string;
  location: TreeLocation;
}

export interface TreeUpdate {
  species?: string;
  height?: number;
  age?: number;
  health_condition?: string;
  last_pruned?: string;
  location?: TreeLocation;
} 