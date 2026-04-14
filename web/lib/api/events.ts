import { api } from './client';
export interface Event { id: string; title: string; description?: string; startDate: string; endDate?: string; price?: number; maxAttendees?: number; status: string; }
export const eventsApi = {
  getAll: async () => (await api.get<{ data: Event[] }>('/events')).data.data,
  create: async (data: Partial<Event>) => (await api.post('/events', data)).data.data,
  update: async (id: string, data: Partial<Event>) => (await api.put(`/events/${id}`, data)).data.data,
  delete: async (id: string) => (await api.delete(`/events/${id}`)).data,
};
