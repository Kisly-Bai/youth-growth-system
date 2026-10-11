import apiService from './api';
import { User, UserRole, ApiResponse } from '../types';
import { jwtDecode } from 'jwt-decode';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  name?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  role: UserRole;
  exp: number;
}

export const authService = {
  // 用户登录
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // 将token存储在localStorage中
      localStorage.setItem('token', response.data.token);
      
      // 将用户信息存储在localStorage中
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },
  
  // 用户注册
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data) {
      // 将token存储在localStorage中
      localStorage.setItem('token', response.data.token);
      
      // 将用户信息存储在localStorage中
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },
  
  // 退出登录
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 重定向到登录页
    window.location.href = '/login';
  },
  
  // 检查是否已登录
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      // 解码token获取过期时间
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // 检查token是否过期
      if (decoded.exp < currentTime) {
        // token已过期，清除localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      // token解码失败，清除localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  },
  
  // 获取当前用户信息
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      return null;
    }
    
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      return null;
    }
  },
  
  // 更新用户信息
  updateProfile: async (userId: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiService.put<User>(`/users/${userId}`, userData);
    
    if (response.success && response.data) {
      // 更新localStorage中的用户信息
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...response.data
        }));
      }
    }
    
    return response;
  },
  
  // 修改密码
  changePassword: async (userId: string, data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    return await apiService.post<void>(`/users/${userId}/change-password`, data);
  },
  
  // 重置密码请求
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return await apiService.post<void>('/auth/reset-password-request', { email });
  },
  
  // 重置密码
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return await apiService.post<void>('/auth/reset-password', { token, newPassword });
  }
};

export default authService; 