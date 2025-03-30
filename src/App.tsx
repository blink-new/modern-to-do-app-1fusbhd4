
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

export default function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { tasks, addTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/inbox" replace />} />
          
          <Route 
            path="inbox" 
            element={
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage and organize your tasks efficiently
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsTaskModalOpen(true)}
                    size="sm"
                    className="gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>

                <TaskList 
                  viewMode={viewMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                <TaskModal
                  isOpen={isTaskModalOpen}
                  onClose={() => setIsTaskModalOpen(false)}
                  onSubmit={(task) => {
                    addTask(task);
                    setIsTaskModalOpen(false);
                  }}
                />
              </div>
            } 
          />
          
          <Route path="dashboard" element={<Dashboard tasks={tasks} />} />
          <Route path="settings" element={<Settings />} />
          <Route path="today" element={<Navigate to="/inbox?filter=today" replace />} />
          <Route path="upcoming" element={<Navigate to="/inbox?filter=upcoming" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}