import { api } from './client';

export interface Path {
  id: string;
  name: string;
  description: string | null;
  order: number | null;
  status: string;
}

export interface CreatePathData {
  name: string;
  description?: string;
  order?: number;
}

export type UpdatePathData = Partial<CreatePathData>;

interface PathsListResponse {
  success: boolean;
  data: Path[];
  count: number;
}

interface PathMutationResponse {
  success: boolean;
  data: Path;
}

export const pathsApi = {
  getAll: async () => {
    const response = await api.get<PathsListResponse>('/paths');
    return response.data.data;
  },

  create: async (data: CreatePathData) => {
    const response = await api.post<PathMutationResponse>('/paths', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePathData) => {
    const response = await api.put<PathMutationResponse>(`/paths/${id}`, data);
    return response.data.data;
  },
};
