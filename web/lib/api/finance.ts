import { api } from './client';
export interface Transaction { id: string; type: string; amount: number; description: string; date: string; status: string; }
export const financeApi = {
  getAll: async () => (await api.get<{ data: Transaction[] }>('/finance')).data.data,
  create: async (data: Partial<Transaction>) => (await api.post('/finance', data)).data.data,
  update: async (id: string, data: Partial<Transaction>) => (await api.put(`/finance/${id}`, data)).data.data,
  delete: async (id: string) => (await api.delete(`/finance/${id}`)).data,
};
