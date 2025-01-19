export interface TreeLocation {
  lat: number;
  lon: number;
}

export interface Tree {
  id: number;
  tag_number: number;
  common_name: string;
  botanical_name: string;
  height?: number;
  diameter?: number;
  crown_height?: number;
  crown_spread?: number;
  last_update?: string;
  contributors?: string;
  notes?: string;
  last_inspection?: string;
  health?: string;
  expert_notes?: string;
  latitude: number;
  longitude: number;
  location: TreeLocation;
  created_at: string;
  updated_at: string;
}

export interface TreeCreate {
  tag_number: number;
  common_name: string;
  botanical_name: string;
  height?: number;
  diameter?: number;
  crown_height?: number;
  crown_spread?: number;
  last_update?: string;
  contributors?: string;
  notes?: string;
  last_inspection?: string;
  health?: string;
  expert_notes?: string;
  location: TreeLocation;
}

export interface TreeUpdate {
  tag_number?: number;
  common_name?: string;
  botanical_name?: string;
  height?: number;
  diameter?: number;
  crown_height?: number;
  crown_spread?: number;
  last_update?: string;
  contributors?: string;
  notes?: string;
  last_inspection?: string;
  health?: string;
  expert_notes?: string;
  location?: TreeLocation;
} 