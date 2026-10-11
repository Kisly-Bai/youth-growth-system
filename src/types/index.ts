// 用户角色类型
export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// 霍兰德职业兴趣代码类型
export enum HollandCode {
  R = 'realistic', // 现实型
  I = 'investigative', // 研究型
  A = 'artistic', // 艺术型
  S = 'social', // 社会型
  E = 'enterprising', // 企业型
  C = 'conventional', // 传统型
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

// 心理测评量表类型
export type AssessmentType = 'phq9' | 'gad7' | 'sas' | 'ses';

// 测评问题选项
export interface AssessmentOption {
  value: number;
  label: string;
}

// 测评问题
export interface AssessmentQuestion {
  id: string;
  content: string;
  options: {
    value: number;
    label: string;
  }[];
}

// 测评量表
export interface Assessment {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  minScore: number;
  maxScore: number;
  scoreRanges: {
    min: number;
    max: number;
    level: string;
    description: string;
  }[];
}

// 用户测评结果
export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  assessmentType: AssessmentType;
  score: number;
  answers: {
    questionId: string;
    selectedValue: number;
  }[];
  level: string;
  feedback: string;
  createdAt: string;
}

// 健康数据类型
export interface HealthData {
  id: string;
  userId: string;
  date: string;
  sleep: {
    hours: number;
    quality: number; // 1-5星级评分
  };
  exercise: {
    minutes: number;
    type: string;
    intensity: number; // 1-5强度评分
  };
  nutrition: {
    meals: number;
    water: number; // 杯数
    quality: number; // 1-5星级评分
  };
  mood: number; // 1-5评分
  notes: string;
}

// 学业成绩类型
export interface Subject {
  id: string;
  name: string;
  category: string; // 文科/理科/综合
  fullScore: number; // 满分值
}

// 成绩记录
export interface GradeRecord {
  id: string;
  userId: string;
  subjectId: string;
  examName: string;
  score: number;
  ranking?: number;
  totalStudents?: number;
  examDate: string;
  createdAt: string;
}

// 时间管理类型
export interface TimeBlock {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  category: string; // 学习/休息/运动/其他
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// 专注记录
export interface FocusSession {
  id: string;
  userId: string;
  title: string;
  duration: number; // 分钟数
  completedDuration: number; // 实际完成的分钟数
  startTime: string;
  endTime: string;
  interruptions: number; // 中断次数
  createdAt: string;
}

// 通用分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 霍兰德职业兴趣测试结果
export interface HollandTestResult {
  id: string;
  userId: string;
  scores: Record<HollandCode, number>;
  primaryCode: HollandCode;
  secondaryCode: HollandCode;
  combinationCode: string;
  suitableCareers: string[];
  answers: {
    questionId: string;
    selectedValue: number;
  }[];
  date: string;
}

// 通用响应格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
} 