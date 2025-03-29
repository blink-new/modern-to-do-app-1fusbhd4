
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock,
  AlertCircle,
  MoreVertical
} from "lucide-react";
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

  const priorityConfig = {
    low: {
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: Clock,
    },
    medium: {
      color: "bg-yellow-50 text-yellow-700 border-yellow-100",
      icon: AlertCircle,
    },
    high: {
      color: "bg-red-50 text-red-700 border-red-100",
      icon: AlertCircle,
    },
  };

  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md",
        task.completed && "opacity-75"
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-4">
        <button
          className="mt-1 rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onComplete(task.id)}
              className="mt-1 text-gray-400 hover:text-gray-600"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "flex-1 text-base font-medium transition-all",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.content}
                </span>

                <div className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                  priorityConfig[task.priority].color
                )}>
                  <PriorityIcon className="h-3 w-3" />
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>

              {(task.notes || !task.completed) && (
                <div className="mt-2">
                  <textarea
                    placeholder="Add notes..."
                    value={task.notes || ""}
                    onChange={(e) => onUpdateNotes(task.id, e.target.value)}
                    className="w-full resize-none rounded-lg bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={task.notes ? 2 : 1}
                  />
                </div>
              )}

              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>Created {task.createdAt.toLocaleDateString()}</span>
                <span>•</span>
                <span>{task.completed ? "Completed" : "In Progress"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(task.id)}
            className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-50 hover:text-red-500 group-hover:opacity-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-50 hover:text-gray-600 group-hover:opacity-100">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}