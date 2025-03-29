
export type Priority = 'low' | 'medium' | 'high';
export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  content: string;
  completed: false;
  createdAt: Date;
  priority: Priority;
  notes?: string;
  category: Category;
  dueDate?: Date;
  tags?: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'board';
  defaultCategory: Category;
  defaultPriority: Priority;
  notifications: boolean;
  soundEnabled: boolean;
}