import { api } from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    churchId: string;
  };
}

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};
