
import { create } from 'zustand';
import type { UserPreferences } from '../lib/types';

interface UserStore {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  preferences: {
    theme: 'light',
    defaultView: 'list',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    notifications: true,
    soundEnabled: true,
    defaultSortBy: 'dueDate',
    defaultSortOrder: 'asc'
  },
  updatePreferences: (newPreferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...newPreferences }
    }))
}));