import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AuthUser } from '../types/auth';
import * as authService from '../services/auth';
import { message } from 'antd';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 初始化 - 检查是否已经登录
  useEffect(() => {
    const checkAuthStatus = () => {
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = authService.loginUser({
        username,
        password
      });
      
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        message.success(result.message);
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请稍后重试');
      return false;
    }
  };

  // 注册函数
  const register = async (userData: any): Promise<boolean> => {
    try {
      const result = authService.registerUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      });
      
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUser(result.user);
        message.success(result.message);
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请稍后重试');
      return false;
    }
  };

  // 退出登录
  const logout = (): void => {
    authService.logoutUser();
    setIsAuthenticated(false);
    setUser(null);
    message.success('已成功退出登录');
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<AuthUser>): Promise<boolean> => {
    if (!user || !user.id) return false;

    try {
      const result = authService.updateUserData(user.id, userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        message.success(result.message);
        return true;
      } else {
        message.error(result.message);
        return false;
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新用户信息失败，请稍后重试');
      return false;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 