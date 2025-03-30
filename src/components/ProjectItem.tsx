
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, GripVertical, FolderClosed } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProjectItem({ project, isActive, onSelect, onEdit }: ProjectItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { deleteProject } = useProjectStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-2 rounded-lg px-2 py-1.5 ${
        isActive ? 'bg-blue-50' : 'hover:bg-gray-100'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </button>

      <button
        onClick={onSelect}
        className="flex flex-1 items-center gap-2 text-sm"
      >
        <div
          className="flex h-4 w-4 items-center justify-center rounded"
          style={{ backgroundColor: project.color }}
        >
          <FolderClosed className="h-3 w-3 text-white" />
        </div>
        <span className={isActive ? 'font-medium text-blue-600' : 'text-gray-700'}>
          {project.name}
        </span>
      </button>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded p-1 opacity-0 hover:bg-gray-200 group-hover:opacity-100"
        >
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 z-20 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Project
              </button>
              <button
                onClick={() => {
                  deleteProject(project.id);
                  setShowMenu(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Project
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}