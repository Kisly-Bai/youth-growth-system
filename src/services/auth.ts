import { v4 as uuidv4 } from 'uuid';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { saveToStorage, getFromStorage, removeFromStorage } from './storage';

// 存储键名
const USERS_STORAGE_KEY = 'youth_growth_users';
const CURRENT_USER_KEY = 'youth_growth_current_user';

/**
 * 简单的密码加密函数（实际环境中应使用更安全的加密方法）
 * @param password 明文密码
 * @returns 加密后的密码
 */
const encryptPassword = (password: string): string => {
  // 这里使用简单的加密算法，实际使用中应该使用更强大的算法如bcrypt
  return window.btoa(password + '_encrypted');
};

/**
 * 验证密码是否正确
 * @param inputPassword 输入的明文密码
 * @param storedPassword 存储的加密密码
 * @returns 是否匹配
 */
const verifyPassword = (inputPassword: string, storedPassword: string): boolean => {
  const encryptedInput = encryptPassword(inputPassword);
  return encryptedInput === storedPassword;
};

/**
 * 获取所有用户
 * @returns 用户数组
 */
const getAllUsers = (): User[] => {
  return getFromStorage<User[]>(USERS_STORAGE_KEY, undefined, []) || [];
};

/**
 * 保存所有用户
 * @param users 用户数组
 */
const saveAllUsers = (users: User[]): void => {
  saveToStorage(USERS_STORAGE_KEY, users);
};

/**
 * 通过用户名查找用户
 * @param username 用户名
 * @returns 用户对象或null
 */
const findUserByUsername = (username: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.username === username);
  return user || null;
};

/**
 * 通过邮箱查找用户
 * @param email 邮箱
 * @returns 用户对象或null
 */
const findUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  return user || null;
};

/**
 * 注册新用户
 * @param registerData 注册数据
 * @returns 结果对象，包含成功状态和消息
 */
export const registerUser = (registerData: RegisterData): { success: boolean; message: string; user?: User } => {
  // 验证用户名和邮箱是否已存在
  if (findUserByUsername(registerData.username)) {
    return { success: false, message: '用户名已存在' };
  }
  
  if (findUserByEmail(registerData.email)) {
    return { success: false, message: '邮箱已被注册' };
  }
  
  // 验证密码是否匹配
  if (registerData.password !== registerData.confirmPassword) {
    return { success: false, message: '两次输入的密码不一致' };
  }
  
  // 创建新用户
  const now = new Date().toISOString();
  const newUser: User = {
    id: uuidv4(),
    username: registerData.username,
    email: registerData.email,
    password: encryptPassword(registerData.password),
    createdAt: now,
    lastLoginAt: now
  };
  
  // 保存用户
  const users = getAllUsers();
  users.push(newUser);
  saveAllUsers(users);
  
  // 自动登录
  saveToStorage(CURRENT_USER_KEY, newUser);
  
  return { 
    success: true, 
    message: '注册成功',
    user: { ...newUser, password: '' } // 返回用户信息但不包含密码
  };
};

/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns 结果对象，包含成功状态和消息
 */
export const loginUser = (credentials: LoginCredentials): { success: boolean; message: string; user?: User } => {
  const user = findUserByUsername(credentials.username);
  
  // 检查用户是否存在
  if (!user) {
    return { success: false, message: '用户名不存在' };
  }
  
  // 验证密码
  if (!verifyPassword(credentials.password, user.password)) {
    return { success: false, message: '密码错误' };
  }
  
  // 更新最后登录时间
  const updatedUser = { 
    ...user, 
    lastLoginAt: new Date().toISOString() 
  };
  
  // 更新用户数据
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  users[userIndex] = updatedUser;
  saveAllUsers(users);
  
  // 保存当前用户
  saveToStorage(CURRENT_USER_KEY, updatedUser);
  
  return { 
    success: true, 
    message: '登录成功',
    user: { ...updatedUser, password: '' } // 返回用户信息但不包含密码
  };
};

/**
 * 获取当前登录用户
 * @returns 当前用户或null
 */
export const getCurrentUser = (): User | null => {
  const user = getFromStorage<User>(CURRENT_USER_KEY);
  return user ? { ...user, password: '' } : null; // 返回用户信息但不包含密码
};

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isUserLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * 用户登出
 */
export const logoutUser = (): void => {
  removeFromStorage(CURRENT_USER_KEY);
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 要更新的用户数据
 * @returns 更新结果
 */
export const updateUserData = (userId: string, userData: Partial<User>): { success: boolean; message: string; user?: User } => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }
  
  // 更新用户数据
  const updatedUser = { ...users[userIndex], ...userData };
  users[userIndex] = updatedUser;
  saveAllUsers(users);
  
  // 如果更新的是当前用户，也更新当前用户信息
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    saveToStorage(CURRENT_USER_KEY, updatedUser);
  }
  
  return { 
    success: true, 
    message: '用户信息已更新',
    user: { ...updatedUser, password: '' } // 返回用户信息但不包含密码
  };
}; 