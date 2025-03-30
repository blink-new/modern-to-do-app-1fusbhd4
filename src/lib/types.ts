
export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId?: string;
  dueDate?: Date;
  category?: Category;
  priority?: Priority;
  notes?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'board';
  defaultCategory: Category;
  defaultPriority: Priority;
  notifications: boolean;
  soundEnabled: boolean;
}