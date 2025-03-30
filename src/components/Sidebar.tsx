
import { useState } from 'react';
import { CheckSquare, LayoutDashboard, Settings, Plus } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { ProjectList } from './ProjectList';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="flex h-full w-60 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-1">
          <button
            onClick={() => onTabChange('tasks')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === 'tasks'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            All Tasks
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-gray-400">PROJECTS</span>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="rounded p-1 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <ProjectList
            activeProjectId={activeTab.startsWith('project-') ? activeTab.split('-')[1] : undefined}
            onProjectSelect={(id) => onTabChange(`project-${id}`)}
          />
        </nav>
      </div>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => onTabChange('settings')}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
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