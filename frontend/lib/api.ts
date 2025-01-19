import { Tree } from '../types/tree';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getTrees(): Promise<Tree[]> {
  const response = await fetch(`${API_URL}/trees`);
  if (!response.ok) {
    throw new Error('Failed to fetch trees');
  }
  return response.json();
}

export async function createTree(tree: Omit<Tree, 'id'>): Promise<Tree> {
  const response = await fetch(`${API_URL}/trees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tree),
  });
  if (!response.ok) {
    throw new Error('Failed to create tree');
  }
  return response.json();
}

export async function updateTree(id: number, tree: Partial<Tree>): Promise<Tree> {
  const response = await fetch(`${API_URL}/trees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tree),
  });
  if (!response.ok) {
    throw new Error('Failed to update tree');
  }
  return response.json();
}

export async function deleteTree(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/trees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete tree');
  }
} 