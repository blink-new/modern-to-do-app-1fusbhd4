
export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';
export type Priority = 'low' | 'medium' | 'high';
export type SortBy = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId?: string;
  dueDate?: Date;
  category?: Category;
  priority?: Priority;
  notes?: string;
  tags?: Tag[];
  subtasks?: Subtask[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
  reminderSet?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'board';
  defaultCategory: Category;
  defaultPriority: Priority;
  notifications: boolean;
  soundEnabled: boolean;
  defaultSortBy: SortBy;
  defaultSortOrder: SortOrder;
}

export interface TaskFilter {
  search?: string;
  category?: Category;
  priority?: Priority;
  tags?: string[];
  completed?: boolean;
  dueDate?: 'today' | 'week' | 'overdue' | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
}