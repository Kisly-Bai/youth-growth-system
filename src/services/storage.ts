/**
 * 本地存储服务
 * 提供数据持久化功能，确保用户数据在浏览器关闭后不会丢失
 */

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 要存储的数据
 * @param userId 可选的用户ID，用于隔离不同用户的数据
 */
export const saveToStorage = (key: string, value: any, userId?: string): void => {
  try {
    const storageKey = userId ? `${userId}_${key}` : key;
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(storageKey, serializedValue);
  } catch (error) {
    console.error('保存数据到本地存储失败:', error);
  }
};

/**
 * 从本地存储获取数据
 * @param key 存储键名
 * @param userId 可选的用户ID，用于隔离不同用户的数据
 * @param defaultValue 默认值，当没有找到存储的数据时返回
 * @returns 存储的数据或默认值
 */
export const getFromStorage = <T>(key: string, userId?: string, defaultValue?: T): T | null => {
  try {
    const storageKey = userId ? `${userId}_${key}` : key;
    const serializedValue = localStorage.getItem(storageKey);
    
    if (serializedValue === null) {
      return defaultValue !== undefined ? defaultValue : null;
    }
    
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('从本地存储获取数据失败:', error);
    return defaultValue !== undefined ? defaultValue : null;
  }
};

/**
 * 从本地存储中删除数据
 * @param key 存储键名
 * @param userId 可选的用户ID，用于隔离不同用户的数据
 */
export const removeFromStorage = (key: string, userId?: string): void => {
  try {
    const storageKey = userId ? `${userId}_${key}` : key;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('从本地存储删除数据失败:', error);
  }
};

/**
 * 清除特定用户的所有数据
 * @param userId 用户ID
 */
export const clearUserStorage = (userId: string): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`${userId}_`)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('清除用户数据失败:', error);
  }
};

/**
 * 清除所有本地存储数据
 */
export const clearAllStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('清除所有本地存储数据失败:', error);
  }
}; 