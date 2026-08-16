import { api } from './axios';
import { LoginPayload, RegisterPayload, SendOtpPayload, CheckOtpPayload, AuthResponse } from '@/types/auth';


function saveUserData(response: AuthResponse) {
  if (response?.status && response?.data) {
    const { tokens, profile } = response.data;
    
    // استخراج الصلاحيات بناءً على الاستجابة التي أرسلتها
    const isAdmin = tokens?.is_admin ?? false;
    const roles = profile?.roles || ['user'];
    
    // تحديد دور موحد (primary role) لتسهيل الفحص لاحقاً
    let primaryRole = 'user';
    if (isAdmin || roles.includes('admin')) {
      primaryRole = 'admin';
    } else if (roles.includes('delivery')) {
      primaryRole = 'delivery';
    }

    // بناء كائن المستخدم الكامل
    const userData = {
      ...(profile || {}),
      is_admin: isAdmin,
      roles: roles,
      role: primaryRole,
    };

    // حفظ البيانات
    localStorage.setItem('user', JSON.stringify(userData));
    if (tokens?.access_token) {
      localStorage.setItem('access_token', tokens.access_token);
    }
    if (tokens?.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }
}





export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('login_field', data.login_field);
    if (data.password) formData.append('password', data.password);

    const response = await api.post('/auth/login', formData);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const formData = new FormData();
    if (data.avatar) formData.append('avatar', data.avatar);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('username', data.username);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    if (data.gender) formData.append('gender', data.gender.toString());
    if (data.password) formData.append('password', data.password);

    const response = await api.post('/auth/register', formData);
    return response.data;
  },

  sendOtp: async (data: SendOtpPayload) => {
    const formData = new FormData();
    formData.append('login_field', data.login_field);
    const response = await api.post('/auth/send-otp', formData);
    return response.data;
  },

  checkOtp: async (data: CheckOtpPayload): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('login_field', data.login_field);
    formData.append('code', data.code);
    const response = await api.post('/auth/check-otp', formData);
    return response.data;
  }
};