
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Category, Task } from '../lib/types';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '../stores/taskStore';
import { motion, AnimatePresence } from 'framer-motion';

interface BoardViewProps {
  tasks: Task[];
}

const categories: Category[] = ['personal', 'work', 'shopping', 'health', 'other'];

const categoryColors = {
  personal: 'bg-purple-50 border-purple-200',
  work: 'bg-blue-50 border-blue-200',
  shopping: 'bg-green-50 border-green-200',
  health: 'bg-red-50 border-red-200',
  other: 'bg-gray-50 border-gray-200',
};

const categoryIcons = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '❤️',
  other: '📌',
};

function DroppableColumn({ category, tasks }: { category: Category; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({
    id: category,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-4 ${categoryColors[category]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[category]}</span>
          <h3 className="text-sm font-medium capitalize text-gray-900">
            {category}
          </h3>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TaskItem
                  task={task}
                  compact
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-200 p-4">
            <p className="text-center text-sm text-gray-500">
              Drop tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BoardView({ tasks }: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { updateTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overCategory = over.id as Category;

    if (activeTask && activeTask.category !== overCategory) {
      updateTask({
        ...activeTask,
        category: overCategory,
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {categories.map(category => (
          <DroppableColumn
            key={category}
            category={category}
            tasks={tasks.filter(task => task.category === category)}
          />
        ))}
      </div>

      <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
        {activeTask && (
          <div className="rounded-lg border bg-white p-4 shadow-lg">
            <TaskItem task={activeTask} compact />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}