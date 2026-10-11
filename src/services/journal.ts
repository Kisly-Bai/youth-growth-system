import { saveToStorage, getFromStorage } from './storage';
import { v4 as uuidv4 } from 'uuid';

// 存储键名
const GOALS_STORAGE_KEY = 'youth_growth_goals';
const ACHIEVEMENTS_STORAGE_KEY = 'youth_growth_achievements';
const MILESTONES_STORAGE_KEY = 'youth_growth_milestones';

// 类型定义
export interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  category: string;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  id: string;
  title: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  significance: number;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 目标相关功能
export const getGoals = (userId: string): Goal[] => {
  return getFromStorage<Goal[]>(GOALS_STORAGE_KEY, userId, []) || [];
};

export const saveGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Goal => {
  const goals = getGoals(userId);
  const now = new Date().toISOString();
  
  const newGoal: Goal = {
    ...goal,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  goals.push(newGoal);
  saveToStorage(GOALS_STORAGE_KEY, goals, userId);
  
  return newGoal;
};

export const updateGoal = (goalId: string, goal: Partial<Goal>, userId: string): Goal | null => {
  const goals = getGoals(userId);
  const index = goals.findIndex(g => g.id === goalId);
  
  if (index === -1) {
    return null;
  }
  
  const updatedGoal = {
    ...goals[index],
    ...goal,
    updatedAt: new Date().toISOString()
  };
  
  goals[index] = updatedGoal;
  saveToStorage(GOALS_STORAGE_KEY, goals, userId);
  
  return updatedGoal;
};

export const deleteGoal = (goalId: string, userId: string): boolean => {
  const goals = getGoals(userId);
  const filteredGoals = goals.filter(g => g.id !== goalId);
  
  if (filteredGoals.length === goals.length) {
    return false;
  }
  
  saveToStorage(GOALS_STORAGE_KEY, filteredGoals, userId);
  return true;
};

// 成就相关功能
export const getAchievements = (userId: string): Achievement[] => {
  return getFromStorage<Achievement[]>(ACHIEVEMENTS_STORAGE_KEY, userId, []) || [];
};

export const saveAchievement = (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Achievement => {
  const achievements = getAchievements(userId);
  const now = new Date().toISOString();
  
  const newAchievement: Achievement = {
    ...achievement,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  achievements.push(newAchievement);
  saveToStorage(ACHIEVEMENTS_STORAGE_KEY, achievements, userId);
  
  return newAchievement;
};

export const updateAchievement = (achievementId: string, achievement: Partial<Achievement>, userId: string): Achievement | null => {
  const achievements = getAchievements(userId);
  const index = achievements.findIndex(a => a.id === achievementId);
  
  if (index === -1) {
    return null;
  }
  
  const updatedAchievement = {
    ...achievements[index],
    ...achievement,
    updatedAt: new Date().toISOString()
  };
  
  achievements[index] = updatedAchievement;
  saveToStorage(ACHIEVEMENTS_STORAGE_KEY, achievements, userId);
  
  return updatedAchievement;
};

export const deleteAchievement = (achievementId: string, userId: string): boolean => {
  const achievements = getAchievements(userId);
  const filteredAchievements = achievements.filter(a => a.id !== achievementId);
  
  if (filteredAchievements.length === achievements.length) {
    return false;
  }
  
  saveToStorage(ACHIEVEMENTS_STORAGE_KEY, filteredAchievements, userId);
  return true;
};

// 里程碑相关功能
export const getMilestones = (userId: string): Milestone[] => {
  return getFromStorage<Milestone[]>(MILESTONES_STORAGE_KEY, userId, []) || [];
};

export const saveMilestone = (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Milestone => {
  const milestones = getMilestones(userId);
  const now = new Date().toISOString();
  
  const newMilestone: Milestone = {
    ...milestone,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  milestones.push(newMilestone);
  saveToStorage(MILESTONES_STORAGE_KEY, milestones, userId);
  
  return newMilestone;
};

export const updateMilestone = (milestoneId: string, milestone: Partial<Milestone>, userId: string): Milestone | null => {
  const milestones = getMilestones(userId);
  const index = milestones.findIndex(m => m.id === milestoneId);
  
  if (index === -1) {
    return null;
  }
  
  const updatedMilestone = {
    ...milestones[index],
    ...milestone,
    updatedAt: new Date().toISOString()
  };
  
  milestones[index] = updatedMilestone;
  saveToStorage(MILESTONES_STORAGE_KEY, milestones, userId);
  
  return updatedMilestone;
};

export const deleteMilestone = (milestoneId: string, userId: string): boolean => {
  const milestones = getMilestones(userId);
  const filteredMilestones = milestones.filter(m => m.id !== milestoneId);
  
  if (filteredMilestones.length === milestones.length) {
    return false;
  }
  
  saveToStorage(MILESTONES_STORAGE_KEY, filteredMilestones, userId);
  return true;
}; 