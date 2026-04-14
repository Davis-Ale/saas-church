import { api } from './client';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  cellId?: string;
  serviceApproved: boolean;
  status: string;
}

export const membersApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Member[] }>('/members');
    return response.data.data;
  },

  create: async (data: Partial<Member>) => {
    const response = await api.post<{ success: boolean; data: Member }>('/members', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Member>) => {
    const response = await api.put<{ success: boolean; data: Member }>(`/members/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};
