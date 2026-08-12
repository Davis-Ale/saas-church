import { api } from './client';

export interface MemberSmallGroup {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  smallGroupId?: string;
  smallGroup?: MemberSmallGroup | null;
  serviceApproved: boolean;
  status: string;
}

export interface CreateMemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  smallGroupId?: string;
  serviceApproved?: boolean;
}

export type UpdateMemberData = Partial<CreateMemberData>;

export interface MembersListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface MembersListResponse {
  success: boolean;
  data: Member[];
  count: number;
  total: number;
}

interface MemberMutationResponse {
  success: boolean;
  data: Member;
}

interface DeleteMemberResponse {
  success: boolean;
  message: string;
}

export const membersApi = {
  getAll: async () => {
    const response = await api.get<MembersListResponse>('/members');
    return response.data.data;
  },

  list: async (params: MembersListParams = {}) => {
    const response = await api.get<MembersListResponse>('/members', {
      params,
    });
    return response.data;
  },

  create: async (data: CreateMemberData) => {
    const response = await api.post<MemberMutationResponse>('/members', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateMemberData) => {
    const response = await api.put<MemberMutationResponse>(`/members/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<DeleteMemberResponse>(`/members/${id}`);
    return response.data;
  },
};
