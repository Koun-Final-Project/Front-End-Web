import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1', // حط رابط الباك إند تبعك بالـ .env
  headers: {
    'Accept': 'application/json',
  },
});

// إضافة الـ Token لأي طلب تلقائياً
// إضافة الـ Token لأي طلب تلقائياً (ما عدا مسارات الـ Auth)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    // التحقق مما إذا كان المسار هو تسجيل الدخول أو إنشاء حساب
    const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
  
    // نضع التوكن فقط إذا كان موجوداً والمسار ليس من مسارات تسجيل الدخول
    if (token && config.headers && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  });