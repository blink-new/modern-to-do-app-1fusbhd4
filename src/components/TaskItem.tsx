
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from './ui/checkbox';
import type { Task } from '../lib/types';
import { useTaskStore } from '../stores/taskStore';

interface TaskItemProps {
  task: Task;
  compact?: boolean;
}

export function TaskItem({ task, compact = false }: TaskItemProps) {
  const { toggleTask } = useTaskStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex cursor-grab items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-gray-300 active:cursor-grabbing ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="h-5 w-5"
        />
      </div>
      
      <div className="flex-1 truncate">
        <p className={`truncate text-sm ${task.completed ? 'text-gray-500 line-through' : ''}`}>
          {task.title}
        </p>
        {!compact && task.description && (
          <p className="mt-1 truncate text-xs text-gray-500">{task.description}</p>
        )}
      </div>
    </div>
  );
}