
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, AlertCircle, Folder } from 'lucide-react';
import type { Category, Priority, Task } from '../lib/types';
import { useProjectStore } from '../stores/projectStore';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialProjectId?: string;
  editingTask?: Task;
}

export function TaskModal({ isOpen, onClose, onSubmit, initialProjectId, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>(initialProjectId);
  
  const projects = useProjectStore((state) => state.projects);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category || 'personal');
      setPriority(editingTask.priority || 'medium');
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : '');
      setNotes(editingTask.notes || '');
      setProjectId(editingTask.projectId);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: Task = {
      id: editingTask?.id || crypto.randomUUID(),
      title: title.trim(),
      completed: editingTask?.completed || false,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes: notes.trim() || undefined,
      projectId,
    };

    onSubmit(task);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('personal');
    setPriority('medium');
    setDueDate('');
    setNotes('');
    setProjectId(initialProjectId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-[101] w-[480px]"
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-base font-semibold">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What needs to be done?"
                      className="w-full"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        Due Date
                      </label>
                      <Input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Tag className="h-3.5 w-3.5" />
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Folder className="h-3.5 w-3.5" />
                        Project
                      </label>
                      <select
                        value={projectId || ''}
                        onChange={(e) => setProjectId(e.target.value || undefined)}
                        className="w-full rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="">No Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional details..."
                      rows={3}
                      className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim()}
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}