
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '../lib/types';

interface ProjectStore {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      reorderProjects: (projects) =>
        set(() => ({
          projects,
        })),
    }),
    {
      name: 'project-storage',
    }
  )
);