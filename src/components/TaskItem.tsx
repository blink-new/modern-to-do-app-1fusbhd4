
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Trash2, GripVertical } from 'lucide-react';
import type { Task } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const project = useProjectStore(
    (state) => task.projectId ? state.projects.find(p => p.id === task.projectId) : undefined
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
      className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <button
          {...listeners}
          {...attributes}
          className="mt-1 cursor-grab touch-none p-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={`mt-1 h-5 w-5 shrink-0 rounded-md border-2 transition-colors ${
            task.completed
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300'
          }`}
        >
          {task.completed && (
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p
              className={`truncate text-sm font-medium ${
                task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {task.title}
            </p>
            {project && (
              <div
                className="rounded-full px-2 py-0.5 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.color,
                }}
              >
                {project.name}
              </div>
            )}
          </div>

          {(task.dueDate || task.category) && (
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
              {task.category && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {task.category}
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="shrink-0 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}