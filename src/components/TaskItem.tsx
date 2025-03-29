
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import type { Task } from "../lib/types";
import { cn } from "../lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export function TaskItem({ task, onComplete, onDelete, onUpdateNotes }: TaskItemProps) {
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

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md",
        task.completed && "opacity-75"
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <button
        className="mt-1 text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onComplete(task.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          
          <span className={cn(
            "flex-1 text-lg font-medium transition-all",
            task.completed && "line-through text-gray-400"
          )}>
            {task.content}
          </span>

          <span className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            priorityColors[task.priority]
          )}>
            {task.priority}
          </span>

          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 text-gray-400 hover:text-red-500 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {(task.notes || !task.completed) && (
          <div className="mt-2 pl-7">
            <textarea
              placeholder="Add notes..."
              value={task.notes || ""}
              onChange={(e) => onUpdateNotes(task.id, e.target.value)}
              className="w-full resize-none rounded border-none bg-gray-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={task.notes ? 2 : 1}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}