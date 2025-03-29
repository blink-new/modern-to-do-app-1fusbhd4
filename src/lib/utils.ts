
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function saveToLocalStorage(tasks: Task[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadFromLocalStorage(): Task[] {
  const tasks = localStorage.getItem('tasks');
  if (!tasks) return [];
  return JSON.parse(tasks).map((task: any) => ({
    ...task,
    createdAt: new Date(task.createdAt)
  }));
}