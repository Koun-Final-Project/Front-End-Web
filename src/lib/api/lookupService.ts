import { api } from './axios';

export const lookupService = {
  // جلب أنواع التبرعات (ملابس، طعام، إلخ)[cite: 2]
  getDonationTypes: async () => {
    const response = await api.get('/donation-type'); //[cite: 2]
    return response.data;
  },

  // جلب وحدات القياس (كرتونة، كغ، قطعة، إلخ)[cite: 2]
  getUnits: async () => {
    const response = await api.get('/unit'); //[cite: 2]
    return response.data;
  }
};