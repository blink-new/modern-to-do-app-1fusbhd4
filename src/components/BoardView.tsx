
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { TaskColumn } from './TaskColumn';
import { TaskItem } from './TaskItem';
import type { Task } from '../lib/types';

export function BoardView() {
  const { tasks, setTasks } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const todoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleDragStart = (event: { active: { id: string } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = tasks.find(task => task.id === activeId);

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SortableContext items={todoTasks.map(t => t.id)}>
          <TaskColumn
            title="To Do"
            tasks={todoTasks}
            status="todo"
          />
        </SortableContext>

        <SortableContext items={completedTasks.map(t => t.id)}>
          <TaskColumn
            title="Completed"
            tasks={completedTasks}
            status="completed"
          />
        </SortableContext>
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <TaskItem task={activeTask} compact />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}