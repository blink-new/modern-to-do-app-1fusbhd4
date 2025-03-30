
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Category, Task } from '../lib/types';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '../stores/taskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface BoardViewProps {
  tasks: Task[];
}

const categories: Category[] = ['personal', 'work', 'shopping', 'health', 'other'];

const categoryColors = {
  personal: 'bg-purple-50/50 border-purple-200 hover:bg-purple-50',
  work: 'bg-blue-50/50 border-blue-200 hover:bg-blue-50',
  shopping: 'bg-green-50/50 border-green-200 hover:bg-green-50',
  health: 'bg-red-50/50 border-red-200 hover:bg-red-50',
  other: 'bg-gray-50/50 border-gray-200 hover:bg-gray-50',
};

const categoryActiveColors = {
  personal: 'bg-purple-100 border-purple-300 shadow-purple-100',
  work: 'bg-blue-100 border-blue-300 shadow-blue-100',
  shopping: 'bg-green-100 border-green-300 shadow-green-100',
  health: 'bg-red-100 border-red-300 shadow-red-100',
  other: 'bg-gray-100 border-gray-300 shadow-gray-100',
};

const categoryIcons = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '❤️',
  other: '📌',
};

const categoryTitles = {
  personal: 'Personal Tasks',
  work: 'Work Projects',
  shopping: 'Shopping List',
  health: 'Health & Wellness',
  other: 'Other Tasks',
};

function DragPreview({ task }: { task: Task }) {
  return (
    <motion.div
      initial={{ rotate: 0, scale: 1 }}
      animate={{ 
        rotate: -3,
        scale: 1.05,
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className="bg-white rounded-xl border border-gray-200 p-3 backdrop-blur-sm bg-white/95"
    >
      <TaskItem task={task} compact />
    </motion.div>
  );
}

function DropPreview({ task }: { task: Task }) {
  return (
    <div className="opacity-40 pointer-events-none border-2 border-dashed border-gray-300 rounded-xl p-2 bg-gray-50/50">
      <TaskItem task={task} compact />
    </div>
  );
}

function DroppableColumn({ 
  category, 
  tasks, 
  activeTask,
}: { 
  category: Category; 
  tasks: Task[]; 
  activeTask: Task | null;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  const bgColor = isOver ? categoryActiveColors[category] : categoryColors[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      ref={setNodeRef}
      className={`rounded-xl border backdrop-blur-sm transition-all duration-300 ${bgColor} ${
        isOver ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01] hover:shadow-md'
      }`}
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{categoryIcons[category]}</span>
              <h3 className="text-sm font-semibold text-gray-900">
                {categoryTitles[category]}
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-100">
              {tasks.length}
              <span className="text-gray-400">tasks</span>
            </span>
          </div>
        </div>

        <div className="space-y-2.5 min-h-[150px]">
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={activeTask?.id === task.id ? 'opacity-40' : ''}
                >
                  <TaskItem
                    task={task}
                    compact
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>

          <AnimatePresence>
            {isOver && activeTask && activeTask.category !== category && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <DropPreview task={activeTask} />
              </motion.div>
            )}
          </AnimatePresence>

          {tasks.length === 0 && !isOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-dashed border-gray-200 p-4 text-center bg-white/50"
            >
              <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <Plus size={16} />
                <span>Add task</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function BoardView({ tasks }: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { updateTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
        tolerance: 5,
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 p-6">
        {categories.map(category => (
          <DroppableColumn
            key={category}
            category={category}
            tasks={tasks.filter(task => task.category === category)}
            activeTask={activeTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <DragPreview task={activeTask} />
        )}
      </DragOverlay>
    </DndContext>
  );
}