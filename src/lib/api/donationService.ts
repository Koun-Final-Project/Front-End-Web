// import { api } from './axios';

// export interface DonationCreatePayload {
//   sender_branch_id: number | string;
//   sender_user_id: number | string;
//   title: string;
//   description?: string;
//   status?: number; // 0 => Pending, 1 => Approved, -1 => Rejected
//   notes?: string;
//   items: {
//     unit_id: number | string;
//     donation_type_id: number | string;
//     name: string;
//     quantity: number | string;
//     notes?: string;
//   }[];
// }

// export interface DonationRequestCreatePayload {
//   receiver_branch_id: number | string;
//   receiver_user_id: number | string;
//   status?: number;
//   notes?: string;
//   items: {
//     donation_item_id: number | string;
//     requested_quantity: number | string;
//   }[];
// }

// export const donationService = {
//   // 1. جلب التبرعات (التي تم تقديمها)
//   getDonations: async () => {
//     const res = await api.get('/donation');
//     return res.data;
//   },

//   // 2. إنشاء تبرع جديد (تقديم تبرع)
//   createDonation: async (data: DonationCreatePayload) => {
//     const formData = new FormData();
//     formData.append('sender_branch_id', String(data.sender_branch_id));
//     formData.append('sender_user_id', String(data.sender_user_id));
//     formData.append('title', data.title);
//     if (data.description) formData.append('description', data.description);
//     formData.append('status', String(data.status ?? 0));
//     if (data.notes) formData.append('notes', data.notes);

//     data.items.forEach((item, index) => {
//       formData.append(`items[${index}][unit_id]`, String(item.unit_id));
//       formData.append(`items[${index}][donation_type_id]`, String(item.donation_type_id));
//       formData.append(`items[${index}][name]`, item.name);
//       formData.append(`items[${index}][quantity]`, String(item.quantity));
//       if (item.notes) formData.append(`items[${index}][notes]`, item.notes);
//     });

//     const res = await api.post('/donation/create', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data;
//   },

//   // 3. جلب طلبات التبرع
//   getDonationRequests: async () => {
//     const res = await api.get('/donation-request?include=receiver_branch.institution.owner,receiver_user');
//     return res.data;
//   },

//   // 4. إنشاء طلب تبرع جديد[cite: 1]
//   createDonationRequest: async (data: DonationRequestCreatePayload) => {
//     const formData = new FormData();
//     formData.append('receiver_branch_id', String(data.receiver_branch_id));
//     formData.append('receiver_user_id', String(data.receiver_user_id));
//     formData.append('status', String(data.status ?? 0));
//     if (data.notes) formData.append('notes', data.notes);

//     data.items.forEach((item, index) => {
//       formData.append(`items[${index}][donation_item_id]`, String(item.donation_item_id));
//       formData.append(`items[${index}][requested_quantity]`, String(item.requested_quantity));
//     });

//     // === اطبع محتويات الـ FormData للكونسول ===
//     for (let [key, value] of formData.entries()) {
//       console.log(`FormData -> ${key}:`, value);
//     }

//     const res = await api.post('/donation-request/create', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return res.data;
//   },
// };


import { api } from './axios';

export interface DonationCreatePayload {
  sender_branch_id: number | string;
  sender_user_id: number | string;
  title: string;
  description?: string;
  status?: number; // 0 => Pending, 1 => Approved, -1 => Rejected
  sent_at?: string;
  notes?: string;
  items: {
    unit_id: number | string;
    donation_type_id: number | string;
    name: string;
    quantity: number | string;
    notes?: string;
  }[];
}

export interface DonationRequestCreatePayload {
  receiver_branch_id: number | string;
  receiver_user_id: number | string;
  status?: number;
  notes?: string;
  items: {
    donation_item_id: number | string;
    requested_quantity: number | string;
  }[];
}

export const donationService = {
    // في ملف donationService.ts (أو ملف الـ api الخاص بالطلبات)
// تحديث حالة طلب التبرع (قبول أو رفض) بالـ status فقط
updateDonationRequestStatus: async (
    requestId: string | number, 
    status: number, 
    notes?: string
  ) => {
    const formData = new FormData();
    formData.append('status', String(status));
    if (notes) formData.append('notes', notes);

    const res = await api.post(`/donation-request/update/${requestId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  // جلب كافة التبرعات المتاحة
  getDonations: async () => {
    const response = await api.get('/donation?include=sender_user,sender_branch.institution,donation_items.unit,donation_items.donation_type');
    return response.data;
  } ,

  // إنشاء تبرع جديد (تقديم تبرع)[cite: 4]
  createDonation: async (data: DonationCreatePayload) => {
    const formData = new FormData();
    formData.append('sender_branch_id', String(data.sender_branch_id));
    formData.append('sender_user_id', String(data.sender_user_id));
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    formData.append('status', String(data.status ?? 0));
    if (data.sent_at) formData.append('sent_at', data.sent_at);
    if (data.notes) formData.append('notes', data.notes);

    data.items.forEach((item, index) => {
      formData.append(`items[${index}][unit_id]`, String(item.unit_id));
      formData.append(`items[${index}][donation_type_id]`, String(item.donation_type_id));
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][quantity]`, String(item.quantity));
      if (item.notes) formData.append(`items[${index}][notes]`, item.notes);
    });

    const res = await api.post('/donation/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // جلب طلبات التبرع[cite: 1]
  getDonationRequests: async () => {
    const res = await api.get('/donation-request?include=receiver_branch.institution.owner,receiver_user');
    return res.data;
  },

  // إنشاء طلب تبرع جديد[cite: 1]
  createDonationRequest: async (data: DonationRequestCreatePayload) => {
    const formData = new FormData();
    formData.append('receiver_branch_id', String(data.receiver_branch_id));
    formData.append('receiver_user_id', String(data.receiver_user_id));
    formData.append('status', String(data.status ?? 0));
    if (data.notes) formData.append('notes', data.notes);

    data.items.forEach((item, index) => {
      formData.append(`items[${index}][donation_item_id]`, String(item.donation_item_id));
      formData.append(`items[${index}][requested_quantity]`, String(item.requested_quantity));
    });

    const res = await api.post('/donation-request/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};