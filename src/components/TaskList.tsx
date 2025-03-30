
import { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { Task } from './Task';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Filter } from 'lucide-react';

interface TaskListProps {
  viewMode: 'list' | 'board';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TaskList({ viewMode, searchQuery, onSearchChange }: TaskListProps) {
  const { tasks } = useTaskStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    dueDate: '',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Tasks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 p-2"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 p-2"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All</option>
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <select
                className="w-full mt-1 rounded-md border border-gray-300 p-2"
                value={filters.dueDate}
                onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
              >
                <option value="">All</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}