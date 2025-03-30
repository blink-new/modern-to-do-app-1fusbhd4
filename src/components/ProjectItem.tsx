
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProjectItem({ project, isActive, onSelect, onEdit }: ProjectItemProps) {
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
      className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
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
        className="flex flex-1 items-center gap-2"
      >
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: project.color }}
        />
        <span className="truncate">{project.name}</span>
      </button>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded p-1 hover:bg-gray-200"
        >
          <Pencil className="h-3.5 w-3.5 text-gray-500" />
        </button>
        <button
          onClick={() => deleteProject(project.id)}
          className="rounded p-1 hover:bg-gray-200"
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}