
export interface Project {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId?: string;
  dueDate?: Date;
}