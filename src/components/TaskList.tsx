
import { useState } from 'react';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { TaskFilter } from './TaskFilter';
import { useTaskStore } from '../stores/taskStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

interface TaskListProps {
  viewMode: 'list' | 'board';
}

export function TaskList({ viewMode }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const { tasks, updateTask, filter, setFilter, resetFilter } = useTaskStore();

  // Apply filters and sorting
  const filteredTasks = tasks.filter(task => {
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.category && task.category !== filter.category) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    if (filter.tags?.length && !task.tags?.some(tag => filter.tags?.includes(tag.id))) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const aValue = a[filter.sortBy];
    const bValue = b[filter.sortBy];
    
    if (!aValue || !bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return filter.sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search || ''}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`gap-2 ${showFilters ? 'border-blue-500 bg-blue-50 text-blue-600' : ''}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetFilter}
        >
          Reset
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && <TaskFilter onClose={() => setShowFilters(false)} />}
      </AnimatePresence>

      {/* Task List */}
      <motion.div 
        layout
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <TaskItem
                task={task}
                onEdit={setEditingTask}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center"
          >
            <p className="text-sm text-gray-500">
              {filter.search
                ? "No tasks match your search"
                : "No tasks yet. Click 'Add Task' to get started."}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={updateTask}
        editingTask={editingTask}
      />
    </>
  );
}