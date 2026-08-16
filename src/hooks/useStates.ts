import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stateService, StatePayload } from '@/lib/api/stateService';
import { toast } from 'sonner';

// جلب الكل
export const useStates = () => {
  return useQuery({
    queryKey: ['states'],
    queryFn: stateService.getAll,
    staleTime: 1000 * 60 * 60, // كاش لمدة ساعة
  });
};

// جلب تفاصيل
export const useStateDetails = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['state', id],
    queryFn: () => stateService.getById(id),
    enabled: enabled && !!id,
  });
};

// إنشاء
export const useCreateState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StatePayload) => stateService.create(data),
    onSuccess: (res) => {
      toast.success(res?.message || 'تمت إضافة المحافظة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء إضافة المحافظة');
    },
  });
};

// تعديل
export const useUpdateState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StatePayload }) => stateService.update(id, data),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم تعديل المحافظة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء التعديل');
    },
  });
};

// حذف
export const useDeleteState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stateService.delete(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم حذف المحافظة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الحذف');
    },
  });
};

// حذف نهائي
export const useForceDeleteState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stateService.forceDelete(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم حذف المحافظة نهائياً');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الحذف النهائي');
    },
  });
};

// استعادة
export const useRestoreState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stateService.restore(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تمت استعادة المحافظة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['states'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الاستعادة');
    },
  });
};