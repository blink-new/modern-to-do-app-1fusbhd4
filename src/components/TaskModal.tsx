
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import type { Category, Priority, Task } from '../lib/types';
import { generateId } from '../lib/utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

export function TaskModal({ isOpen, onClose, onSubmit }: TaskModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const task: Task = {
      id: generateId(),
      content: content.trim(),
      completed: false,
      createdAt: new Date(),
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes: notes.trim() || undefined,
    };

    onSubmit(task);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setContent('');
    setCategory('personal');
    setPriority('medium');
    setDueDate('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[480px] -translate-x-1/2 -translate-y-1/2 transform"
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h2 className="text-base font-semibold text-gray-900">Create New Task</h2>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1 hover:bg-gray-50 active:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  {/* Task Name */}
                  <div>
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What needs to be done?"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-base placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Due Date */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Due Date
                      </label>
                      <input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Tag className="h-3.5 w-3.5" />
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional details..."
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}