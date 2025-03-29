
export interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}