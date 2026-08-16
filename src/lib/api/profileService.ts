
import { api } from './axios';
import { User } from '@/types/user';

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  avatar?: File | null;
}

export const profileService = {
  // جلب بيانات البروفايل
  getProfile: async (): Promise<{ data: { profile: User } }> => {
    const response = await api.get('/profile/show?include=roles');
    return response.data;
  },

  // تحديث البروفايل
  updateProfile: async (data: UpdateProfilePayload) => {
    const formData = new FormData();
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.username) formData.append('username', data.username);
    if (data.password) formData.append('password', data.password);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await api.post('/profile/update/', formData);
    return response.data;
  }
};