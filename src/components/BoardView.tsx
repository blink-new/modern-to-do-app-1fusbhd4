
import { DndContext, DragOverlay, closestCorners, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { TaskColumn } from './TaskColumn';
import { TaskItem } from './TaskItem';
import type { Task } from '../lib/types';

export function BoardView() {
  const { tasks, setTasks, updateTask } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const todoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Handle dropping into columns
    if (over.id === 'completed' || over.id === 'todo') {
      const newCompleted = over.id === 'completed';
      if (activeTask.completed !== newCompleted) {
        updateTask(activeTask.id, { completed: newCompleted });
      }
    } else {
      // Handle reordering within columns
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        setTasks(newTasks);
      }
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
        <TaskColumn
          id="todo"
          title="To Do"
          tasks={todoTasks}
          status="todo"
        />
        <TaskColumn
          id="completed"
          title="Completed"
          tasks={completedTasks}
          status="completed"
        />
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <TaskItem task={activeTask} compact />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}