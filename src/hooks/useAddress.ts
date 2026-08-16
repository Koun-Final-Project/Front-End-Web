import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService, AddressPayload } from '@/lib/api/addressService';
import { toast } from 'sonner';

// جلب كل العناوين
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAll,
  });
};

// جلب تفاصيل عنوان
export const useAddressDetails = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['address', id],
    queryFn: () => addressService.getById(id),
    enabled: enabled && !!id,
  });
};

// إنشاء عنوان
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressPayload) => addressService.create(data),
    onSuccess: (res) => {
      toast.success(res?.message || 'تمت إضافة العنوان بنجاح');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء إضافة العنوان');
    },
  });
};

// تعديل عنوان
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressPayload }) => addressService.update(id, data),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم تعديل العنوان بنجاح');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء تعديل العنوان');
    },
  });
};

// حذف عنوان
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.delete(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم حذف العنوان بنجاح');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء حذف العنوان');
    },
  });
};

// حذف نهائي للعنوان
export const useForceDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.forceDelete(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تم حذف العنوان نهائياً');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الحذف النهائي');
    },
  });
};

// استعادة عنوان
export const useRestoreAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.restore(id),
    onSuccess: (res) => {
      toast.success(res?.message || 'تمت استعادة العنوان بنجاح');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الاستعادة');
    },
  });
};