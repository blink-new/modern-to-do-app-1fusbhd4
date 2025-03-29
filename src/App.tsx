
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Plus, AlertCircle, ListFilter } from "lucide-react";
import { Layout } from "./components/ui/Layout";
import { TaskItem } from "./components/TaskItem";
import { TaskModal } from "./components/TaskModal";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";
import type { Task, UserPreferences } from "./lib/types";
import { saveToLocalStorage, loadFromLocalStorage } from "./lib/utils";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [view, setView] = useState<"tasks" | "dashboard" | "settings">("tasks");
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    defaultView: 'list',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    notifications: true,
    soundEnabled: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadedTasks = loadFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    saveToLocalStorage(tasks);
  }, [tasks]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const addTask = (task: Task) => {
    setTasks([task, ...tasks]);

    if (preferences.soundEnabled) {
      // Play a subtle sound effect
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBkCU1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTqO0/DRgDMGHm7A7+OZRA0PVqzn77BdGAg+ltryxnMpBSh8yu7blEILFlyx6OyrWBUIQ5zd8sFuJAU3jNDu1YU2Bhxqvu3mnEcODlOq5e+zYBoIPJPY8cp2KwUme8jt3pZFDBVZr+btrVoXCECY2/LDcSYFNYnO79iIOQYbarv');
      audio.play();
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));

    if (preferences.soundEnabled) {
      // Play a different sound for completion
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBkCU1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTqO0/DRgDMGHm7A7+OZRA0PVqzn77BdGAg+ltryxnMpBSh8yu7blEILFlyx6OyrWBUIQ5zd8sFuJAU3jNDu1YU2Bhxqvu3mnEcODlOq5e+zYBoIPJPY8cp2KwUme8jt3pZFDBVZr+btrVoXCECY2/LDcSYFNYnO79iIOQYbarv');
      audio.play();
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateNotes = (id: string, notes: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, notes } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard tasks={tasks} />;
      case "settings":
        return <Settings preferences={preferences} onUpdate={setPreferences} />;
      default:
        return (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListFilter className="h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onComplete={toggleComplete}
                        onDelete={deleteTask}
                        onUpdateNotes={updateNotes}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>

            {filteredTasks.length === 0 && (
              <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-lg font-medium text-gray-900">No tasks found</p>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "all"
                    ? "Get started by adding a new task above"
                    : `No ${filter} tasks found`}
                </p>
              </div>
            )}

            <TaskModal
              isOpen={isTaskModalOpen}
              onClose={() => setIsTaskModalOpen(false)}
              onSubmit={addTask}
            />
          </>
        );
    }
  };

  return (
    <Layout view={view} onViewChange={setView}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {view === "dashboard"
            ? "Dashboard"
            : view === "settings"
            ? "Settings"
            : "My Tasks"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {view === "dashboard"
            ? "Track your productivity and task completion"
            : view === "settings"
            ? "Customize your task management experience"
            : "Manage and organize your tasks efficiently"}
        </p>
      </div>

      {renderContent()}
    </Layout>
  );
}