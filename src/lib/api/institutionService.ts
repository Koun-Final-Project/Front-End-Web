// import { api } from './axios';

// export interface CreateInstitutionPayload {
//   name: string;
//   description: string;
//   phone: string;
//   email: string;
//   type: 1 | 2 | 3; 
//   logo?: File | null;
//   attachments?: File[];
// }

// // الكائن بالكامل عليه export
// export const institutionService = {
  
//   // 1. عرض الكل
//   getInstitutions: async (forUser: number = 1) => {
//     const response = await api.get(`/institution?filter[for_user]=${forUser}&include=owner,branches,user_institutions,members`);
//     return response.data;
//   },

//   // 2. الإضافة
//   create: async (data: CreateInstitutionPayload) => {
//     // ... (كود الـ FormData اللي كتبناه سابقاً)
//     const formData = new FormData();
//     // ...
//     const response = await api.post('/institution/create/', formData);
//     return response.data;
//   },

//   // 3. عرض تفاصيل مؤسسة محددة (أضفناها هنا جوا القوسين)
//   getInstitutionById: async (id: number) => {
//     const response = await api.get(`/institution/show/${id}?include=owner,branches,user_institutions,members`);
//     return response.data;
//   },

//   // 4. الحذف (أضفناها هنا جوا القوسين)
//   delete: async (id: number) => {
//     const response = await api.delete(`/institution/delete/${id}`);
//     return response.data;
//   }

// }; // نهاية الكائن

import { api } from './axios';

export interface CreateInstitutionPayload {
  name: string;
  description: string;
  phone: string;
  email: string;
  type: 1 | 2 | 3; 
  logo?: File | null;
  attachments?: File[];
}

export const institutionService = {
  // 1. جلب المؤسسات
 // 1. جلب المؤسسات
 getInstitutions: async (forUser: number = 1) => {
    const response = await api.get(
      `/institution?filter[for_user]=${forUser}&include=branches.donations.donation_items,branches.donation_requests.donation_request_items,branches.address,members,owner`
    );
    return response.data;
  },

  // 2. إنشاء مؤسسة (معالجة محكمة للـ FormData والـ Headers)
  create: async (data: CreateInstitutionPayload) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('type', String(data.type));
    
    if (data.logo) {
      formData.append('logo', data.logo);
    }
    
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    // استخراج User ID بشكل ديناميكي وآمن مهما كان شكله بالـ localStorage
    let userId = "1";
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        userId = String(parsed.id || parsed.profile?.id || parsed.user?.id || parsed.data?.id || "1");
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    formData.append('users[0][user_id]', userId);
    formData.append('users[0][is_admin]', '1');

    // إرسال الطلب مع إجبار الهيدر الصحيح
    const response = await api.post('/institution/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // 3. عرض تفاصيل مؤسسة
  getInstitutionById: async (id: number) => {
    const response = await api.get(`/institution/show/${id}?include=owner,branches,user_institutions,members`);
    return response.data;
  },

  // 4. حذف مؤسسة
  delete: async (id: number) => {
    const response = await api.delete(`/institution/delete/${id}`);
    return response.data;
  }
};