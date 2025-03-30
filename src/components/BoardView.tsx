
import { DndContext, DragOverlay, closestCorners, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { TaskColumn } from './TaskColumn';
import { TaskItem } from './TaskItem';
import type { Task } from '../lib/types';

export function BoardView() {
  const { tasks, setTasks, updateTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = {
    todo: tasks.filter(task => !task.completed),
    completed: tasks.filter(task => task.completed)
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // Dropping over a column
    if (overId === 'todo' || overId === 'completed') {
      const task = tasks.find(t => t.id === activeId);
      if (task) {
        const newCompleted = overId === 'completed';
        if (task.completed !== newCompleted) {
          updateTask(task.id, { completed: newCompleted });
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        setTasks(newTasks);
      }

      // Handle column drops
      if (over.id === 'todo' || over.id === 'completed') {
        const task = tasks.find(t => t.id === active.id);
        if (task) {
          const newCompleted = over.id === 'completed';
          updateTask(task.id, { completed: newCompleted });
        }
      }
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskColumn
          id="todo"
          title="To Do"
          tasks={columns.todo}
          status="todo"
        />
        <TaskColumn
          id="completed"
          title="Completed"
          tasks={columns.completed}
          status="completed"
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskItem task={activeTask} compact />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}