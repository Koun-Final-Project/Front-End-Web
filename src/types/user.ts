export interface User {
    id: number;
    avatar?: string;
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    email: string;
    gender?: 1 | 2; // 1 => Male, 2 => Female
    birthday?: string;
  }