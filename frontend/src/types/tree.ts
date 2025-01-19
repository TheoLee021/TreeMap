export interface TreeLocation {
  lat: number;
  lon: number;
}

export interface Tree {
  id: number;
  tag_number?: string;
  species: string;
  common_name?: string;
  height: number;
  diameter: number;
  crown_height?: number;
  crown_spread?: number;
  health_condition: string;
  last_inspection?: string;
  last_pruned?: string;
  contributors?: string;
  notes?: string;
  latitude: number;
  longitude: number;
  location: TreeLocation;
  created_at: string;
  updated_at: string;
}

export interface TreeCreate {
  species: string;
  common_name?: string;
  height: number;
  diameter: number;
  crown_height?: number;
  crown_spread?: number;
  health_condition: string;
  last_inspection?: string;
  last_pruned?: string;
  contributors?: string;
  notes?: string;
  location: TreeLocation;
}

export interface TreeUpdate {
  species?: string;
  common_name?: string;
  height?: number;
  diameter?: number;
  crown_height?: number;
  crown_spread?: number;
  health_condition?: string;
  last_inspection?: string;
  last_pruned?: string;
  contributors?: string;
  notes?: string;
  location?: TreeLocation;
} 