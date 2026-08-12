import { api } from './client';

export interface SmallGroupMember {
  id: string;
  firstName: string;
  lastName: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  leaderId?: string;
  address?: string;
  meetingDay?: string;
  meetingTime?: string;
  status: string;
  members?: SmallGroupMember[];
}

export interface CreateSmallGroupData {
  name: string;
  leaderId?: string;
  address?: string;
  meetingDay?: string;
  meetingTime?: string;
}

export type UpdateSmallGroupData = Partial<CreateSmallGroupData>;

interface SmallGroupsListResponse {
  success: boolean;
  data: SmallGroup[];
  count: number;
}

interface SmallGroupMutationResponse {
  success: boolean;
  data: SmallGroup;
}

interface DeleteSmallGroupResponse {
  success: boolean;
  message: string;
}

export const smallGroupsApi = {
  getAll: async () => {
    const response = await api.get<SmallGroupsListResponse>('/small-groups');
    return response.data.data;
  },

  create: async (data: CreateSmallGroupData) => {
    const response = await api.post<SmallGroupMutationResponse>('/small-groups', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateSmallGroupData) => {
    const response = await api.put<SmallGroupMutationResponse>(`/small-groups/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<DeleteSmallGroupResponse>(`/small-groups/${id}`);
    return response.data;
  },
};
