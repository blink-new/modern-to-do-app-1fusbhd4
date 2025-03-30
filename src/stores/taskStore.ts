
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Tag, Comment, Subtask, TaskFilter } from '../lib/types';

interface TaskStore {
  tasks: Task[];
  tags: Tag[];
  filter: TaskFilter;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  reorderTasks: (tasks: Task[]) => void;
  
  // New Tag Functions
  addTag: (tag: Tag) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  
  // New Subtask Functions
  addSubtask: (taskId: string, subtask: Subtask) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // New Comment Functions
  addComment: (taskId: string, comment: Comment) => void;
  updateComment: (taskId: string, comment: Comment) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  
  // New Filter Functions
  setFilter: (filter: Partial<TaskFilter>) => void;
  resetFilter: () => void;
  
  // New Reminder Functions
  toggleReminder: (taskId: string) => void;
  getOverdueTasks: () => Task[];
  getUpcomingTasks: () => Task[];
}

const defaultFilter: TaskFilter = {
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [],
      filter: defaultFilter,

      addTask: (task) =>
        set((state) => ({
          tasks: [{
            ...task,
            createdAt: new Date(),
            updatedAt: new Date(),
          }, ...state.tasks],
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id 
              ? { 
                  ...t, 
                  completed: !t.completed,
                  updatedAt: new Date()
                } 
              : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      updateTask: (updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === updatedTask.id 
              ? {
                  ...updatedTask,
                  updatedAt: new Date()
                }
              : t
          ),
        })),

      reorderTasks: (tasks) =>
        set(() => ({
          tasks,
        })),

      // Tag Management
      addTag: (tag) =>
        set((state) => ({
          tags: [...state.tags, tag],
        })),

      updateTag: (updatedTag) =>
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === updatedTag.id ? updatedTag : t
          ),
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
          tasks: state.tasks.map((task) => ({
            ...task,
            tags: task.tags?.filter((t) => t.id !== id),
          })),
        })),

      // Subtask Management
      addSubtask: (taskId, subtask) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: [...(t.subtasks || []), subtask],
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks?.map((s) =>
                    s.id === subtaskId
                      ? { ...s, completed: !s.completed }
                      : s
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks?.filter((s) => s.id !== subtaskId),
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      // Comment Management
      addComment: (taskId, comment) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [...(t.comments || []), comment],
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      updateComment: (taskId, updatedComment) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: t.comments?.map((c) =>
                    c.id === updatedComment.id
                      ? { ...updatedComment, updatedAt: new Date() }
                      : c
                  ),
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      deleteComment: (taskId, commentId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: t.comments?.filter((c) => c.id !== commentId),
                  updatedAt: new Date(),
                }
              : t
          ),
        })),

      // Filter Management
      setFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),

      resetFilter: () =>
        set(() => ({
          filter: defaultFilter,
        })),

      // Reminder Management
      toggleReminder: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, reminderSet: !t.reminderSet }
              : t
          ),
        })),

      getOverdueTasks: () => {
        const now = new Date();
        return get().tasks.filter((task) =>
          task.dueDate && new Date(task.dueDate) < now && !task.completed
        );
      },

      getUpcomingTasks: () => {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return get().tasks.filter((task) =>
          task.dueDate &&
          new Date(task.dueDate) > now &&
          new Date(task.dueDate) <= nextWeek
        );
      },
    }),
    {
      name: 'task-storage',
    }
  )
);