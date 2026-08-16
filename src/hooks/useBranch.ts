import { useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService, BranchPayload } from '@/lib/api/branchService';
import { toast } from 'sonner';

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BranchPayload) => branchService.create(data),
    onSuccess: () => {
      toast.success('تمت إضافة الفرع بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors || error.response?.data?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        toast.error(`خطأ: ${validationErrors[firstErrorKey][0]}`);
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الفرع');
      }
    }
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BranchPayload }) => branchService.update(id, data),
    onSuccess: () => {
      toast.success('تم تعديل الفرع بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors || error.response?.data?.data?.errors;
      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        toast.error(`خطأ: ${validationErrors[firstErrorKey][0]}`);
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء التعديل');
      }
    }
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => branchService.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الفرع بنجاح');
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحذف');
    }
  });
};