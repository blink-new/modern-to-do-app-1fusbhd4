
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreHorizontal } from 'lucide-react';
import type { Project } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export function ProjectItem({ project, isActive, onSelect, onEdit }: ProjectItemProps) {
  const { deleteProject } = useProjectStore();
  const [showMenu, setShowMenu] = useState(false);
  
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
      className="relative"
    >
      <div
        className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
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
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="truncate">{project.name}</span>
        </button>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-0 z-30 mt-8 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Edit project
              </button>
              <button
                onClick={() => {
                  deleteProject(project.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete project
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}