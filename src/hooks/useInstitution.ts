import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { institutionService, CreateInstitutionPayload } from '@/lib/api/institutionService';
import { toast } from 'sonner';

// 1. هوك جلب المؤسسات (اللي كان ناقص)
export const useInstitutions = (forUser: number = 1) => {
  return useQuery({
    queryKey: ['institutions', forUser],
    queryFn: () => institutionService.getInstitutions(forUser),
  });
};

// 2. هوك إنشاء مؤسسة
export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInstitutionPayload) => institutionService.create(data),
    onSuccess: (response) => {
      toast.success(response?.message || 'تم إرسال طلب تسجيل المؤسسة بنجاح! بانتظار موافقة الإدارة.');
      
      // هاي الضيفة السحرية: بتخلي الجدول يعمل ريفريش لحاله وتظهر المؤسسة فوراً بعد الإضافة
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        // عرض أول خطأ من أخطاء التحقق
        const firstErrorKey = Object.keys(validationErrors)[0];
        toast.error(`خطأ: ${validationErrors[firstErrorKey][0]}`);
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب');
      }
    }
  });
};


// 3. هوك جلب تفاصيل مؤسسة محددة
export const useInstitutionDetails = (id: number, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['institution', id],
      queryFn: () => institutionService.getInstitutionById(id),
      enabled: enabled, // عشان ما يضرب الـ API إلا لما نطلب منه (مثلاً لما نفتح الـ Modal تبع العرض)
    });
  };
  
  // 4. هوك حذف مؤسسة
  export const useDeleteInstitution = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: number) => institutionService.delete(id),
      onSuccess: (response) => {
        toast.success(response?.message || 'تم حذف المؤسسة بنجاح');
        // تحديث الجدول فوراً بعد الحذف
        queryClient.invalidateQueries({ queryKey: ['institutions'] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحذف');
      }
    });
  };