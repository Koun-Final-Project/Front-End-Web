import { api } from './axios';

export interface StateItem {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface StatePayload {
  name: string;
}

export const stateService = {
  // 1. جلب كل المحافظات
  getAll: async () => {
    const response = await api.get('/state'); //[cite: 2]
    return response.data;
  },

  // 2. جلب تفاصيل محافظة محددة
  getById: async (id: number) => {
    const response = await api.get(`/state/show/${id}`); //[cite: 2]
    return response.data;
  },

  // 3. إنشاء محافظة جديدة
  create: async (data: StatePayload) => {
    const formData = new FormData();
    formData.append('name', data.name); //[cite: 2]

    const response = await api.post('/state/create/', formData, { //[cite: 2]
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 4. تعديل محافظة
  update: async (id: number, data: StatePayload) => {
    const formData = new FormData();
    formData.append('name', data.name); //[cite: 2]

    const response = await api.post(`/state/update/${id}`, formData, { //[cite: 2]
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 5. حذف ناعم (Soft Delete)
  delete: async (id: number) => {
    const response = await api.delete(`/state/delete/${id}`); //[cite: 2]
    return response.data;
  },

  // 6. حذف نهائي (Force Delete)
  forceDelete: async (id: number) => {
    const response = await api.delete(`/state/force-delete/${id}`); //[cite: 2]
    return response.data;
  },

  // 7. استعادة المحذوف (Restore)
  restore: async (id: number) => {
    const response = await api.get(`/state/restore/${id}`); //[cite: 2]
    return response.data;
  },
};