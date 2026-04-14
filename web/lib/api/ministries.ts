import { api } from './client';
export interface Ministry { id: string; name: string; description?: string; status: string; }
export const ministriesApi = {
  getAll: async () => (await api.get<{ data: Ministry[] }>('/ministries')).data.data,
  create: async (data: Partial<Ministry>) => (await api.post('/ministries', data)).data.data,
  update: async (id: string, data: Partial<Ministry>) => (await api.put(`/ministries/${id}`, data)).data.data,
  delete: async (id: string) => (await api.delete(`/ministries/${id}`)).data,
};
