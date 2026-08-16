// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { donationService, DonationCreatePayload, DonationRequestCreatePayload } from '@/lib/api/donationService';
// import { toast } from 'sonner';

// export const useDonationsList = () => {
//   return useQuery({
//     queryKey: ['donations-list'],
//     queryFn: donationService.getDonations,
//   });
// };

// export const useCreateDonation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: DonationCreatePayload) => donationService.createDonation(data),
//     onSuccess: () => {
//       toast.success('تم تقديم التبرع بنجاح!');
//       queryClient.invalidateQueries({ queryKey: ['donations-list'] });
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || 'حدث خطأ أثناء تقديم التبرع');
//     },
//   });
// };

// export const useDonationRequestsList = () => {
//   return useQuery({
//     queryKey: ['donation-requests-list'],
//     queryFn: donationService.getDonationRequests,
//   });
// };

// export const useCreateDonationRequest = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: DonationRequestCreatePayload) => donationService.createDonationRequest(data),
//     onSuccess: () => {
//       toast.success('تم إرسال طلب التبرع بنجاح!');
//       queryClient.invalidateQueries({ queryKey: ['donation-requests-list'] });
//     },
//     onError: (err: any) => {
//       toast.error(err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب');
//     },
//   });
// };


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationService, DonationCreatePayload, DonationRequestCreatePayload } from '@/lib/api/donationService';
import { donationToast, requestToast } from '@/lib/toasts';


export function useUpdateDonationRequestStatus() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, status, notes }: any) => 
        donationService.updateDonationRequestStatus(id, status, notes),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['donation-requests'] });
      },
    });
  }
export const useDonationsList = () => {
  return useQuery({
    queryKey: ['donations-list'],
    queryFn: donationService.getDonations,
  });
};

export const useCreateDonation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DonationCreatePayload) => donationService.createDonation(data),
    onSuccess: () => {
      donationToast.createSuccess();
      queryClient.invalidateQueries({ queryKey: ['donations-list'] });
    },
    onError: (err: any) => {
      donationToast.createError(err.response?.data?.message);
    },
  });
};

export const useDonationRequestsList = () => {
  return useQuery({
    queryKey: ['donation-requests-list'],
    queryFn: donationService.getDonationRequests,
  });
};

export const useCreateDonationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DonationRequestCreatePayload) => donationService.createDonationRequest(data),
    onSuccess: () => {
      requestToast.createSuccess();
      queryClient.invalidateQueries({ queryKey: ['donation-requests-list'] });
    },
    onError: (err: any) => {
      requestToast.createError(err.response?.data?.message);
    },
  });
};



