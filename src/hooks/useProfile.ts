import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, UpdateProfilePayload } from '@/lib/api/profileService';
import { toast } from 'sonner';

// Hook لجلب بيانات المستخدم
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    // قراءة البيانات المبدئية من الـ localStorage لتسريع العرض ريثما يتم الجلب من السيرفر
    initialData: () => {
      const user = localStorage.getItem('user');
      if (user) {
        return { data: { profile: JSON.parse(user) } };
      }
      return undefined;
    },
  });
};

// Hook لتحديث بيانات المستخدم
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileService.updateProfile(data),
    onSuccess: (response) => {
      toast.success('تم تحديث الملف الشخصي بنجاح');
      
      // إجبار React Query على تحديث البيانات المخبأة
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // تحديث البيانات في الـ Local Storage لتبقى متزامنة
      if (response.data?.profile) {
        localStorage.setItem('user', JSON.stringify(response.data.profile));
      }
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        toast.error(`خطأ: ${validationErrors[firstErrorKey][0]}`);
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء التحديث');
      }
    }
  });
};