
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../lib/types';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '../stores/taskStore';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'completed';
}

export function TaskColumn({ title, tasks, status }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const { toggleTask } = useTaskStore();

  return (
    <div
      ref={setNodeRef}
      className="flex h-full flex-col rounded-xl border bg-gray-50/50 p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            compact
            onEdit={() => {}}
          />
        ))}
      </div>
    </div>
  );
}