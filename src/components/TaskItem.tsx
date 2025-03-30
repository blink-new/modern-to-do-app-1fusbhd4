
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Pencil, Trash2, GripVertical, Calendar, Tag, AlertCircle } from 'lucide-react';
import type { Task } from '../lib/types';
import { useTaskStore } from '../stores/taskStore';

interface TaskItemProps {
  task: Task;
  compact?: boolean;
  onEdit?: (task: Task) => void;
}

const priorityColors = {
  low: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    hover: 'group-hover:bg-emerald-100',
  },
  medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'group-hover:bg-amber-100',
  },
  high: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    hover: 'group-hover:bg-rose-100',
  },
};

const categoryIcons = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '❤️',
  other: '📌',
};

export function TaskItem({ task, compact, onEdit }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();
  
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

  const priorityColor = task.priority ? priorityColors[task.priority] : null;

  if (compact) {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.01 }}
        className={`group relative rounded-lg border bg-white p-3 transition-all duration-200
          ${isDragging ? 'z-50 shadow-lg' : 'hover:shadow-md'}
          ${task.completed ? 'border-gray-100 bg-gray-50' : 'border-gray-200'}
        `}
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            className="mt-1 cursor-grab touch-none text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Checkbox */}
          <div 
            className="flex h-5 w-5 items-center justify-center"
            onClick={handleCheckboxClick}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}}
              className="h-4 w-4 cursor-pointer rounded-md border-2 border-gray-300 
                transition-colors duration-200 
                checked:border-blue-500 checked:bg-blue-500 
                hover:border-blue-500"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <p className={`text-sm font-medium transition-all duration-200
              ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}
            `}>
              {task.title}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              {task.category && (
                <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {categoryIcons[task.category]}
                  <span className="capitalize">{task.category}</span>
                </span>
              )}
              {task.priority && (
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                  ${priorityColor?.bg} ${priorityColor?.text} ${priorityColor?.border}
                  transition-colors duration-200 ${priorityColor?.hover}
                `}>
                  <AlertCircle className="h-3 w-3" />
                  <span className="capitalize">{task.priority}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditClick}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteClick}
            className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-200
        ${isDragging ? 'z-50 shadow-lg' : 'hover:shadow-md'}
        ${task.completed ? 'border-gray-100 bg-gray-50' : 'border-gray-200'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          className="mt-1 cursor-grab touch-none text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Checkbox */}
        <div 
          className="flex h-5 w-5 items-center justify-center"
          onClick={handleCheckboxClick}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => {}}
            className="h-5 w-5 cursor-pointer rounded-md border-2 border-gray-300 
              transition-colors duration-200 
              checked:border-blue-500 checked:bg-blue-500 
              hover:border-blue-500"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-2">
          <p className={`text-base font-medium transition-all duration-200
            ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}
          `}>
            {task.title}
          </p>
          
          <div className="flex flex-wrap items-center gap-2">
            {task.category && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600">
                {categoryIcons[task.category]}
                <span className="capitalize">{task.category}</span>
              </span>
            )}
            {task.priority && (
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium
                ${priorityColor?.bg} ${priorityColor?.text} ${priorityColor?.border}
                transition-colors duration-200 ${priorityColor?.hover}
              `}>
                <AlertCircle className="h-4 w-4" />
                <span className="capitalize">{task.priority}</span>
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {task.notes && (
            <p className={`text-sm transition-all duration-200
              ${task.completed ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {task.notes}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditClick}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteClick}
            className="rounded-full p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}