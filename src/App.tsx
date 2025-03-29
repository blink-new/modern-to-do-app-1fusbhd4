
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
import { AnimatePresence, motion } from "framer-motion";
import { Plus, AlertCircle, ListFilter } from "lucide-react";
import { Layout } from "./components/ui/Layout";
import { TaskItem } from "./components/TaskItem";
import type { Task } from "./lib/types";
import { generateId, saveToLocalStorage, loadFromLocalStorage } from "./lib/utils";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: generateId(),
      content: newTask,
      completed: false,
      createdAt: new Date(),
      priority: "medium",
    };

    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and organize your tasks efficiently
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Total Tasks</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">In Progress</div>
          <div className="mt-1 text-2xl font-bold text-blue-600">{stats.active}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Completed</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
      </div>

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

        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </form>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 rounded-xl border border-dashed border-gray-300 p-8 text-center"
        >
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-lg font-medium text-gray-900">No tasks found</p>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "all"
              ? "Get started by adding a new task above"
              : `No ${filter} tasks found`}
          </p>
        </motion.div>
      )}
    </Layout>
  );
}