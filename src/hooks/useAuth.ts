import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { authService } from '@/lib/api/authService';
import { AuthResponse } from '@/types/auth';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response: AuthResponse) => {
      // تفكيك البيانات بناءً على شكل الـ JSON الجديد
      const { tokens, profile } = response.data;
      
      // حفظ التوكن وبيانات المستخدم في اللوكال ستورج
      localStorage.setItem('token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('user', JSON.stringify(profile));
      
      toast.success(response.message || 'تم تسجيل الدخول بنجاح');
      navigate({ to: '/dashboard' });
    },
    // ملاحظة: الـ onError الخاص بالـ Login عم نعالجه بصفحة auth.tsx عشان نمرر الإيميل للرابط
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
    // ملاحظة: الـ onSuccess والـ onError عم نعالجهم بصفحة auth.tsx
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: authService.sendOtp,
    onSuccess: () => toast.success('تم إرسال رمز التحقق بنجاح'),
    onError: () => toast.error('حدث خطأ في إرسال الرمز'),
  });
};

export const useCheckOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.checkOtp,
    onSuccess: (response: AuthResponse) => {
      const { tokens, profile } = response.data;
      
      localStorage.setItem('token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('user', JSON.stringify(profile));
      
      toast.success(response.message || 'تم التحقق بنجاح! أهلاً بك');
      navigate({ to: '/dashboard' });
    },
    onError: () => toast.error('رمز التحقق غير صحيح أو منتهي الصلاحية'),
  });
};