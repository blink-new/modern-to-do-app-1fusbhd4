
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { useTaskStore } from '../stores/taskStore';
import type { Task } from '../lib/types';

interface TaskListProps {
  tasks: Task[];
  projectId?: string;
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toggleTask, deleteTask, updateTask, reorderTasks } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(undefined)}
        onSubmit={updateTask}
        initialProjectId={projectId}
        editingTask={editingTask}
      />
    </>
  );
}