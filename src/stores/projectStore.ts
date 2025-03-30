
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../lib/types';
import { generateId } from '../lib/utils';

interface ProjectStore {
  projects: Project[];
  addProject: (name: string, description: string, color: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  reorderProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (name, description, color) => {
        const newProject: Project = {
          id: generateId(),
          name,
          description,
          color,
          order: Date.now(),
          createdAt: new Date(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },
      reorderProjects: (projects) => {
        set({ projects });
      },
    }),
    {
      name: 'project-store',
    }
  )
);