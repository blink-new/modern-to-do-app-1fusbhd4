
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "./TaskItem";
import { useTaskStore } from "../stores/taskStore";
import { createPortal } from "react-dom";

export function TaskList({ compact = false }) {
  const { tasks, reorderTasks } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} compact={compact} />
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay adjustScale={true}>
          {activeTask ? (
            <TaskItem task={activeTask} compact={compact} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}