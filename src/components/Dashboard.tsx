
import { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Tag,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import type { Task } from '../lib/types';

interface DashboardProps {
  tasks: Task[];
}

export function Dashboard({ tasks }: DashboardProps) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && !t.completed;
    }).length
  };

  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate completion rate trend
  const completionRate = stats.total ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';
  const isPositiveTrend = parseFloat(completionRate) > 50;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">All time</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="rounded-full bg-green-50 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            {isPositiveTrend ? (
              <>
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Trending up</span>
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Needs attention</span>
              </>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Tasks</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="rounded-full bg-yellow-50 p-2">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">In progress</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
            <div className="rounded-full bg-red-50 p-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-500">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Category and Priority Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Tag className="h-4 w-4" />
            Category Distribution
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{category}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{
                      width: `${(count / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <AlertCircle className="h-4 w-4" />
            Priority Distribution
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries(priorityStats).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{priority}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${
                      priority === 'high'
                        ? 'bg-red-500'
                        : priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${(count / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Calendar className="h-4 w-4" />
          Recent Activity
        </h3>
        <div className="mt-4">
          <div className="space-y-4">
            {tasks
              .slice(0, 5)
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((task) => (
                <div key={task.id} className="flex items-center gap-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      task.completed
                        ? 'bg-green-500'
                        : task.priority === 'high'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {task.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.createdAt.toLocaleDateString()} in{' '}
                      <span className="capitalize">{task.category}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      task.completed
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}