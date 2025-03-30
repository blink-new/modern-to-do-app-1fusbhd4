
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { TaskFilter } from './TaskFilter';
import { useTaskStore } from '../stores/taskStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '../lib/types';

interface TaskListProps {
  tasks: Task[];
  projectId?: string;
}

export function TaskList({ tasks: initialTasks, projectId }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toggleTask, deleteTask, updateTask, reorderTasks, filter } = useTaskStore();

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

  // Apply filters and sorting
  const filteredTasks = initialTasks.filter(task => {
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.category && task.category !== filter.category) {
      return false;
    }
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }
    if (filter.tags?.length && !task.tags?.some(tag => filter.tags?.includes(tag.id))) {
      return false;
    }
    if (filter.dueDate) {
      const now = new Date();
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      
      if (!taskDate) return false;
      
      if (filter.dueDate === 'today') {
        return taskDate.toDateString() === now.toDateString();
      }
      if (filter.dueDate === 'week') {
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return taskDate > now && taskDate <= nextWeek;
      }
      if (filter.dueDate === 'overdue') {
        return taskDate < now;
      }
    }
    return true;
  }).sort((a, b) => {
    const aValue = a[filter.sortBy];
    const bValue = b[filter.sortBy];
    
    if (!aValue || !bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return filter.sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
      const newIndex = filteredTasks.findIndex(t => t.id === over.id);
      
      const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <>
      <TaskFilter />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-3"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={filteredTasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    layout: { duration: 0.2 },
                    opacity: { duration: 0.2 },
                  }}
                  style={{
                    position: 'relative',
                    opacity: activeId === task.id ? 0.5 : 1,
                  }}
                >
                  <TaskItem
                    task={task}
                    onEdit={setEditingTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                ✨
              </motion.div>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter.search
                ? "No tasks match your search"
                : "Get started by adding your first task"}
            </p>
          </motion.div>
        )}
      </motion.div>

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