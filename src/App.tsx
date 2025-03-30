
import { useState } from 'react';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { useTaskStore } from './stores/taskStore';
import { LayoutGrid, List, Plus, Home, Calendar, CheckCircle2, Clock, Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const { addTask } = useTaskStore();

  const navigation = [
    { name: 'Home', icon: Home, href: '#', current: true },
    { name: 'Today', icon: Calendar, href: '#', current: false },
    { name: 'Upcoming', icon: Clock, href: '#', current: false },
    { name: 'Completed', icon: CheckCircle2, href: '#', current: false },
    { name: 'Settings', icon: Settings, href: '#', current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="flex">
        {/* Navigation Sidebar */}
        <div className="fixed inset-y-0 flex w-64 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
            <span className="font-semibold">Task Manager</span>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  item.current
                    ? 'bg-gray-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                    'h-5 w-5 shrink-0'
                  )}
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 pl-64">
          <div className="mx-auto max-w-5xl px-8 py-8">
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
      </div>
    </div>
  );
}