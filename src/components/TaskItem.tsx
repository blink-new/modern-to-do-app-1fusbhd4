
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "./ui/checkbox";
import { useTaskStore } from "../stores/taskStore";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  compact?: boolean;
}

export function TaskItem({ task, compact = false }: TaskItemProps) {
  const { toggleTask } = useTaskStore();
  const navigate = useNavigate();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(task.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking checkbox or dragging
    if (!(e.target as HTMLElement).closest('.checkbox-wrapper')) {
      navigate(`/task/${task.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex items-start gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-gray-300 ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
      onClick={handleClick}
    >
      <div className="checkbox-wrapper" onClick={handleCheckboxChange}>
        <Checkbox
          checked={task.completed}
          className="h-5 w-5"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? "text-gray-500 line-through" : ""}`}>
          {task.title}
        </p>
        {!compact && task.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
      </div>
    </div>
  );
}