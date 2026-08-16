import { api } from './axios';

export interface AddressPayload {
  branch_id?: number | string;
  state_id: number | string;
  city: string;
  street: string;
  latitude?: number | string;
  longitude?: number | string;
  details?: string;
}

export const addressService = {
  // 1. جلب كافة العناوين
  getAll: async () => {
    const response = await api.get('/address'); //[cite: 2]
    return response.data;
  },

  // 2. جلب تفاصيل عنوان محدد
  getById: async (id: number) => {
    const response = await api.get(`/address/show/${id}`); //[cite: 2]
    return response.data;
  },

  // 3. إنشاء عنوان جديد
  create: async (data: AddressPayload) => {
    const formData = new FormData();
    if (data.branch_id) formData.append('branch_id', String(data.branch_id)); //[cite: 2]
    formData.append('state_id', String(data.state_id)); //[cite: 2]
    formData.append('city', data.city); //[cite: 2]
    formData.append('street', data.street); //[cite: 2]
    formData.append('latitude', String(data.latitude || '33.5138')); //[cite: 2]
    formData.append('longitude', String(data.longitude || '36.2765')); //[cite: 2]
    if (data.details) formData.append('details', data.details); //[cite: 2]

    const response = await api.post('/address/create/', formData, { //[cite: 2]
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 4. تعديل عنوان
  update: async (id: number, data: AddressPayload) => {
    const formData = new FormData();
    if (data.branch_id) formData.append('branch_id', String(data.branch_id)); //[cite: 2]
    formData.append('state_id', String(data.state_id)); //[cite: 2]
    formData.append('city', data.city); //[cite: 2]
    formData.append('street', data.street); //[cite: 2]
    formData.append('latitude', String(data.latitude || '33.5138')); //[cite: 2]
    formData.append('longitude', String(data.longitude || '36.2765')); //[cite: 2]
    if (data.details) formData.append('details', data.details); //[cite: 2]

    const response = await api.post(`/address/update/${id}`, formData, { //[cite: 2]
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 5. حذف ناعم (Soft Delete)
  delete: async (id: number) => {
    const response = await api.delete(`/address/delete/${id}`); //[cite: 2]
    return response.data;
  },

  // 6. حذف نهائي (Force Delete)
  forceDelete: async (id: number) => {
    const response = await api.delete(`/address/force-delete/${id}`); //[cite: 2]
    return response.data;
  },

  // 7. استعادة المحذوف (Restore)
  restore: async (id: number) => {
    const response = await api.get(`/address/restore/${id}`); //[cite: 2]
    return response.data;
  },
};