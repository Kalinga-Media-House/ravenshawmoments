export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends BaseEntity {
  auth_user_id: string;
  email?: string;
  full_name?: string;
  username?: string;
  slug?: string;
  bio?: string;
  avatar_url?: string;
  department_id?: string;
  hostel_id?: string;
}

export interface DepartmentSummary extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export * from "./profile";

