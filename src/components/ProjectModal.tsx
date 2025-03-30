
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useProjectStore } from '../stores/projectStore';
import type { Project } from '../lib/types';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject?: Project;
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
];

export function ProjectModal({ isOpen, onClose, editingProject }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const { addProject, updateProject, projects } = useProjectStore();

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setColor(editingProject.color);
    } else {
      setName('');
      setColor(COLORS[0]);
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    if (editingProject) {
      updateProject({
        ...editingProject,
        name: name.trim(),
        color,
      });
    } else {
      addProject({
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
        order: projects.length,
      });
    }

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
        >
          <div className="absolute right-2 top-2">
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 block w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter project name"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Color
                  </label>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {COLORS.map((c) => (
                      <motion.button
                        key={c}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`h-8 w-8 rounded-full transition-shadow ${
                          c === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-200'
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}