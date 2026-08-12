import { api } from './client';

export interface Ministry {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

export interface CreateMinistryData {
  name: string;
  description?: string;
}

export type UpdateMinistryData = Partial<CreateMinistryData>;

interface MinistriesListResponse {
  success: boolean;
  data: Ministry[];
  count: number;
}

interface MinistryMutationResponse {
  success: boolean;
  data: Ministry;
}

interface DeleteMinistryResponse {
  success: boolean;
  message: string;
}

export const ministriesApi = {
  getAll: async () => {
    const response = await api.get<MinistriesListResponse>('/ministries');
    return response.data.data;
  },

  create: async (data: CreateMinistryData) => {
    const response = await api.post<MinistryMutationResponse>('/ministries', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateMinistryData) => {
    const response = await api.put<MinistryMutationResponse>(`/ministries/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<DeleteMinistryResponse>(`/ministries/${id}`);
    return response.data;
  },
};
