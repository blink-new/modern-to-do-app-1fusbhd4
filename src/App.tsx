
import { useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { useTaskStore } from './stores/taskStore';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const { addTask } = useTaskStore();

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your tasks efficiently
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                className="h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue="all"
              >
                <option value="all">All Tasks</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-9 w-9 items-center justify-center transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`flex h-9 w-9 items-center justify-center border-l transition-colors ${
                  viewMode === 'board'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={() => setIsTaskModalOpen(true)}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        <TaskList viewMode={viewMode} />

        {/* Task Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(task) => {
            addTask(task);
            setIsTaskModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}