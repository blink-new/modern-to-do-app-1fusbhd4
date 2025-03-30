
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import type { Task } from '../lib/types';
import { useTaskStore } from '../stores/taskStore';

interface TaskItemProps {
  task: Task;
  compact?: boolean;
  onEdit?: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-50 text-green-700',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-red-50 text-red-700',
};

export function TaskItem({ task, compact, onEdit }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(task.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
          task.completed ? 'opacity-75' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            className="mt-1 cursor-grab touch-none text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Checkbox */}
          <div 
            className="flex h-4 w-4 items-center justify-center"
            onClick={handleCheckboxClick}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}} // Handled by onClick
              className="h-4 w-4 cursor-pointer rounded border-gray-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <p className={`text-sm ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </p>
            {task.priority && (
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          className="mt-1 cursor-grab touch-none text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Checkbox */}
        <div 
          className="flex h-4 w-4 items-center justify-center"
          onClick={handleCheckboxClick}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {}} // Handled by onClick
            className="h-4 w-4 cursor-pointer rounded border-gray-300"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-1">
          <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {task.category && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {task.category}
              </span>
            )}
            {task.priority && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {task.notes && (
            <p className="text-sm text-gray-500">{task.notes}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}