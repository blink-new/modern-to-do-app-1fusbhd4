
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import type { Task } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const project = useProjectStore(
    (state) => task.projectId ? state.projects.find(p => p.id === task.projectId) : undefined
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 h-5 w-5 shrink-0 rounded-md border-2 ${
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
              {task.content}
            </p>
            {project && (
              <div
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.color,
                }}
              >
                {project.name}
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {task.category}
            </div>
          </div>
        </div>

        <motion.button
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}