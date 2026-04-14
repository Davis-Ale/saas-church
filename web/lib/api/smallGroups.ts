import { api } from './client';

export interface SmallGroup {
  id: string;
  name: string;
  leaderId?: string;
  address?: string;
  meetingDay?: string;
  meetingTime?: string;
  status: string;
  members?: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
}

export const smallGroupsApi = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: SmallGroup[] }>('/small-groups');
    return response.data.data;
  },

  create: async (data: Partial<SmallGroup>) => {
    const response = await api.post<{ success: boolean; data: SmallGroup }>('/small-groups', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<SmallGroup>) => {
    const response = await api.put<{ success: boolean; data: SmallGroup }>(`/small-groups/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/small-groups/${id}`);
    return response.data;
  },
};
