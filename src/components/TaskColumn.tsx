
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../lib/types';
import { TaskItem } from './TaskItem';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  status: 'todo' | 'completed';
}

export function TaskColumn({ id, title, tasks, status }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'Column',
      status
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[400px] flex-col rounded-xl border bg-gray-50/50 p-4 transition-colors ${
        isOver ? 'bg-gray-100/80 ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-sm">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              compact
            />
          ))}
          
          {tasks.length === 0 && (
            <div className={`flex flex-1 items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors ${
              isOver ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}>
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}