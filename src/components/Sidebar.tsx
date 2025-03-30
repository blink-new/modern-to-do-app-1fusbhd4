
import { useState } from 'react';
import { 
  CheckSquare, 
  LayoutDashboard, 
  Settings, 
  Plus,
  ChevronRight,
  Inbox,
  Calendar as CalendarIcon,
  ListTodo,
  FolderClosed
} from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { ProjectList } from './ProjectList';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../stores/projectStore';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState(true);
  const { projects } = useProjectStore();

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {/* Inbox */}
          <button
            onClick={() => onTabChange('inbox')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'inbox'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Inbox className="h-4 w-4" />
            Inbox
          </button>

          {/* Tasks Section with Nested Projects */}
          <div className="mt-2">
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                <motion.div
                  animate={{ rotate: isTasksExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
                TASKS & PROJECTS
              </button>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence>
              {isTasksExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden pl-3"
                >
                  {/* Task Views */}
                  <button
                    onClick={() => onTabChange('today')}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'today'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CheckSquare className="h-4 w-4" />
                    Today
                  </button>

                  <button
                    onClick={() => onTabChange('upcoming')}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'upcoming'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Upcoming
                  </button>

                  {/* Projects List */}
                  {projects.length > 0 && (
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <div className="px-3 py-1">
                        <span className="text-xs font-medium text-gray-400">
                          PROJECTS
                        </span>
                      </div>
                      <ProjectList
                        activeProjectId={activeTab.startsWith('project-') ? activeTab.split('-')[1] : undefined}
                        onProjectSelect={(id) => onTabChange(`project-${id}`)}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dashboard */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        </nav>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => onTabChange('settings')}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}