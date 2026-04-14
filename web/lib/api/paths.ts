import { api } from './client';
export interface Path { id: string; name: string; description?: string; order?: number; status: string; }
export const pathsApi = {
  getAll: async () => (await api.get<{ data: Path[] }>('/paths')).data.data,
  create: async (data: Partial<Path>) => (await api.post('/paths', data)).data.data,
  update: async (id: string, data: Partial<Path>) => (await api.put(`/paths/${id}`, data)).data.data,
  delete: async (id: string) => (await api.delete(`/paths/${id}`)).data,
};
