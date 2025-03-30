
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
  projectId?: string;
}

export function TaskList({ projectId }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { tasks, toggleTask, deleteTask, updateTask, reorderTasks } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = projectId
    ? tasks.filter(task => task.projectId === projectId)
    : tasks;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
      const newIndex = filteredTasks.findIndex(t => t.id === over.id);
      
      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
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
            items={filteredTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
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