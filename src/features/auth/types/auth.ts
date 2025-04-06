export type UserRole = 'ADMIN' | 'VENDOR' | 'DRIVER' | 'MANAGER';

export interface LoginRequest {
  username: string;  // email
  password: string;
}

export interface LoginResponse {
  access: string;
  role: UserRole;
}

export interface UserProfile {
  profile_unique_id: string;
  profile_organization: string;
  profile_firstname: string;
  profile_lastname: string;
  profile_email: string;
  profile_phone: string;
  profile_type: string;
  user_role: {
    role_name: string;
    role_description: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
} 