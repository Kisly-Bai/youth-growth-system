import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

// 创建axios实例
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误和统一的响应格式
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回数据部分
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误状态码的情况
      const { status, data } = error.response;

      // 处理401未授权错误 - 清除token并重定向到登录页
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // 统一返回错误格式
      return Promise.reject({
        success: false,
        error: data.message || '服务器错误',
        status,
      });
    } else if (error.request) {
      // 请求已发送但没有收到响应
      return Promise.reject({
        success: false,
        error: '网络错误，无法连接到服务器',
      });
    } else {
      // 请求配置出错
      return Promise.reject({
        success: false,
        error: '请求配置错误',
      });
    }
  }
);

// 通用请求方法
const request = async <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    return await api.request<any, ApiResponse<T>>(config);
  } catch (error: any) {
    return error;
  }
};

// 导出各种请求方法
export const apiService = {
  get: <T>(url: string, params?: any) => 
    request<T>({ method: 'GET', url, params }),
  
  post: <T>(url: string, data?: any) => 
    request<T>({ method: 'POST', url, data }),
  
  put: <T>(url: string, data?: any) => 
    request<T>({ method: 'PUT', url, data }),
  
  patch: <T>(url: string, data?: any) => 
    request<T>({ method: 'PATCH', url, data }),
  
  delete: <T>(url: string, params?: any) => 
    request<T>({ method: 'DELETE', url, params }),
};

export default apiService; 