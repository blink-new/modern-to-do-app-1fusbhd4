
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import type { Category, Priority, SortBy } from '../lib/types';

export function TaskFilter() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { filter, setFilter, resetFilter, tags } = useTaskStore();
  
  const handleSort = (sortBy: SortBy) => {
    setFilter({
      sortBy,
      sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.search || ''}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full rounded-lg border-gray-200 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {filter.search && (
            <button
              onClick={() => setFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors
            ${isExpanded ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
          `}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>

        <button
          onClick={() => resetFilter()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Category
                </label>
                <select
                  value={filter.category || ''}
                  onChange={(e) => setFilter({ category: e.target.value as Category || undefined })}
                  className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Priority
                </label>
                <select
                  value={filter.priority || ''}
                  onChange={(e) => setFilter({ priority: e.target.value as Priority || undefined })}
                  className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date Filter */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Due Date
                </label>
                <select
                  value={filter.dueDate || ''}
                  onChange={(e) => setFilter({ dueDate: e.target.value as 'today' | 'week' | 'overdue' | null || undefined })}
                  className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                >
                  <option value="">All Dates</option>
                  <option value="today">Due Today</option>
                  <option value="week">Due This Week</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Sort By
                </label>
                <div className="mt-1 flex gap-2">
                  <select
                    value={filter.sortBy}
                    onChange={(e) => setFilter({ sortBy: e.target.value as SortBy })}
                    className="w-full rounded-lg border-gray-200 text-sm"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                    <option value="createdAt">Created</option>
                  </select>
                  <button
                    onClick={() => setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
                    className="flex items-center justify-center rounded-lg border border-gray-200 px-3 hover:bg-gray-50"
                  >
                    {filter.sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4 text-gray-600" />
                    ) : (
                      <SortDesc className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-medium text-gray-500">
                  Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        const currentTags = filter.tags || [];
                        const newTags = currentTags.includes(tag.id)
                          ? currentTags.filter((id) => id !== tag.id)
                          : [...currentTags, tag.id];
                        setFilter({ tags: newTags });
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors
                        ${
                          filter.tags?.includes(tag.id)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                      style={{
                        backgroundColor: filter.tags?.includes(tag.id) ? tag.color + '33' : undefined,
                        color: filter.tags?.includes(tag.id) ? tag.color : undefined,
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}