
export type Category = 'personal' | 'work' | 'shopping' | 'health' | 'other';
export type Priority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  category: Category;
  priority: Priority;
  dueDate?: Date;
  notes?: string;
  projectId?: string;
}