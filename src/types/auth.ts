import { User } from './user';

export interface LoginPayload {
  login_field: string; // username, phone or email
  password?: string;
}

export interface RegisterPayload {
  avatar?: File;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  email: string;
  gender?: 1 | 2;
  password?: string;
}

export interface SendOtpPayload {
  login_field: string;
}

export interface CheckOtpPayload {
  login_field: string;
  code: string;
}

// بناءً على أغلب الـ APIs، الرد بيكون فيه التوكن والمستخدم
export interface AuthResponse {
    status: boolean;
    message: string;
    data: {
      tokens: {
        access_token: string;
        refresh_token: string;
        is_admin: boolean | null;
      };
      profile: User;
    };
  }