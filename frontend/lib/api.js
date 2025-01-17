import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export const getTrees = async () => {
  const { data } = await api.get('/trees/');
  return data;
};

export const createTree = async (treeData) => {
  const { data } = await api.post('/trees/', treeData);
  return data;
};

export const updateTree = async (id, treeData) => {
  const { data } = await api.put(`/trees/${id}`, treeData);
  return data;
};

export const deleteTree = async (id) => {
  const { data } = await api.delete(`/trees/${id}`);
  return data;
}; 