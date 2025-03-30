
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, AlertCircle, ListFilter, LayoutGrid, List } from "lucide-react";
import { Layout } from "./components/ui/Layout";
import { TaskList } from "./components/TaskList";
import { BoardView } from "./components/BoardView";
import { TaskModal } from "./components/TaskModal";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";
import { useTaskStore } from "./stores/taskStore";
import type { Task, UserPreferences } from "./lib/types";

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [view, setView] = useState<"tasks" | "dashboard" | "settings">("tasks");
  const [taskView, setTaskView] = useState<"list" | "board">("list");
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    defaultView: 'list',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    notifications: true,
    soundEnabled: true,
  });

  const { tasks, addTask } = useTaskStore();

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
              <div className="flex items-center gap-4">
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

                <div className="flex rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setTaskView("list")}
                    className={`flex items-center gap-1 rounded px-3 py-1 text-sm ${
                      taskView === "list"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                  <button
                    onClick={() => setTaskView("board")}
                    className={`flex items-center gap-1 rounded px-3 py-1 text-sm ${
                      taskView === "board"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Board
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>

            <AnimatePresence mode="wait">
              {taskView === "list" ? (
                <TaskList tasks={filteredTasks} />
              ) : (
                <BoardView tasks={filteredTasks} />
              )}
            </AnimatePresence>

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