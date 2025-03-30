
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { useTaskStore } from './stores/taskStore';
import { Plus } from 'lucide-react';
import { Button } from './components/ui/button';
import type { TaskFilter } from './lib/types';

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { tasks, addTask } = useTaskStore();
  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    defaultView: 'list',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    notifications: true,
    soundEnabled: true,
    defaultSortBy: 'dueDate',
    defaultSortOrder: 'asc'
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/inbox" replace />} />
          
          <Route 
            path="inbox" 
            element={
              <TasksView 
                isModalOpen={isTaskModalOpen}
                onOpenModal={() => setIsTaskModalOpen(true)}
                onCloseModal={() => setIsTaskModalOpen(false)}
                onAddTask={(task) => {
                  addTask(task);
                  setIsTaskModalOpen(false);
                }}
              />
            } 
          />
          
          <Route 
            path="dashboard" 
            element={<Dashboard tasks={tasks} />} 
          />
          
          <Route 
            path="settings" 
            element={
              <Settings 
                preferences={userPreferences}
                onUpdate={setUserPreferences}
              />
            } 
          />

          <Route 
            path="today" 
            element={
              <TasksView 
                isModalOpen={isTaskModalOpen}
                onOpenModal={() => setIsTaskModalOpen(true)}
                onCloseModal={() => setIsTaskModalOpen(false)}
                onAddTask={addTask}
                initialFilter={{ dueDate: 'today' }}
              />
            } 
          />

          <Route 
            path="upcoming" 
            element={
              <TasksView 
                isModalOpen={isTaskModalOpen}
                onOpenModal={() => setIsTaskModalOpen(true)}
                onCloseModal={() => setIsTaskModalOpen(false)}
                onAddTask={addTask}
                initialFilter={{ dueDate: 'week' }}
              />
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

interface TasksViewProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onAddTask: (task: any) => void;
  initialFilter?: Partial<TaskFilter>;
}

function TasksView({ 
  isModalOpen, 
  onOpenModal, 
  onCloseModal, 
  onAddTask,
  initialFilter 
}: TasksViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [filter, setFilter] = useState<TaskFilter>({
    sortBy: 'dueDate',
    sortOrder: 'asc',
    ...initialFilter
  });

  const handleFilterChange = (value: string) => {
    switch (value) {
      case 'all':
        setFilter({
          ...filter,
          completed: undefined,
          dueDate: undefined
        });
        break;
      case 'today':
        setFilter({
          ...filter,
          completed: false,
          dueDate: 'today'
        });
        break;
      case 'upcoming':
        setFilter({
          ...filter,
          completed: false,
          dueDate: 'week'
        });
        break;
      case 'completed':
        setFilter({
          ...filter,
          completed: true,
          dueDate: undefined
        });
        break;
    }
  };

  // Determine the current filter value for the select
  const getCurrentFilterValue = () => {
    if (filter.completed === true) return 'completed';
    if (filter.dueDate === 'today') return 'today';
    if (filter.dueDate === 'week') return 'upcoming';
    return 'all';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and organize your tasks efficiently
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              className="h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
              value={getCurrentFilterValue()}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <Button
          onClick={onOpenModal}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Task List */}
      <TaskList viewMode={viewMode} filter={filter} />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onAddTask}
      />
    </div>
  );
}