export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'student' | 'parent' | 'teacher' | 'admin';
  password: string; // 实际应用中应该使用加密后的密码
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
} 