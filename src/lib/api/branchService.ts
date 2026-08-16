import { api } from './axios';

export interface BranchAddressPayload {
  id?: number;
  state_id: number;
  city: string;
  street: string;
  latitude?: number | string;
  longitude?: number | string;
  details?: string;
}

export interface BranchPayload {
  id?: number;
  name: string;
  description?: string;
  institution_id: number;
  phone: string;
  email: string;
  is_main_branch: boolean | number;
  address: BranchAddressPayload;
}

export const branchService = {
  // 1. إنشاء فرع جديد
  create: async (data: BranchPayload) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('institution_id', String(data.institution_id));
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('is_main_branch', data.is_main_branch ? '1' : '0');

    // العنوان
    formData.append('address[state_id]', String(data.address.state_id || 1));
    formData.append('address[city]', data.address.city);
    formData.append('address[street]', data.address.street);
    formData.append('address[latitude]', String(data.address.latitude || '33.5138'));
    formData.append('address[longitude]', String(data.address.longitude || '36.2765'));
    if (data.address.details) formData.append('address[details]', data.address.details);

    // ربط المستخدم الحالي كمدير للفرع
    let userId = "1";
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || parsed.data?.id || "1");
      } catch (e) {
        console.error(e);
      }
    }
    formData.append('users[0][user_id]', userId);
    formData.append('users[0][is_admin]', '1');

    const response = await api.post('/branch/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 2. تعديل فرع موجود
  update: async (id: number, data: BranchPayload) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('institution_id', String(data.institution_id));
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('is_main_branch', data.is_main_branch ? '1' : '0');

    if (data.address.id) formData.append('address[id]', String(data.address.id));
    formData.append('address[state_id]', String(data.address.state_id || 1));
    formData.append('address[city]', data.address.city);
    formData.append('address[street]', data.address.street);
    formData.append('address[latitude]', String(data.address.latitude || '33.5138'));
    formData.append('address[longitude]', String(data.address.longitude || '36.2765'));
    if (data.address.details) formData.append('address[details]', data.address.details);

    let userId = "1";
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || parsed.data?.id || "1");
      } catch (e) {
        console.error(e);
      }
    }
    formData.append('users[0][user_id]', userId);
    formData.append('users[0][is_admin]', '1');

    const response = await api.post(`/branch/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 3. حذف فرع
  delete: async (id: number) => {
    const response = await api.delete(`/branch/delete/${id}`);
    return response.data;
  }
};