/**
 * ID生成器工具函数
 * 提供为不同实体生成唯一ID的功能
 */

/**
 * 生成时间块ID
 * @returns 唯一的时间块ID
 */
export const generateTimeBlockId = (): string => {
  return `time-block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * 生成专注会话ID
 * @returns 唯一的专注会话ID
 */
export const generateFocusSessionId = (): string => {
  return `focus-session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * 生成学习目标ID
 * @returns 唯一的学习目标ID
 */
export const generateLearningGoalId = (): string => {
  return `learning-goal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * 生成通用唯一ID
 * @param prefix ID前缀
 * @returns 带有指定前缀的唯一ID
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}; 