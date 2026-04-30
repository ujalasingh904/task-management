import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { ListTodo, Filter } from 'lucide-react';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    fetchTasks();
  }, [filter, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await taskAPI.getAll(params);
      let sorted = response.data.data;

      if (sortBy === 'dueDate') {
        sorted = sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        sorted = sorted.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
      }

      setTasks(sorted);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">All Tasks</h1>
          <p className="text-gray-600">View and manage all your tasks here</p>
        </div>

        {/* Filters */}
        <div className="card bg-white mb-6 flex flex-wrap gap-4">
          <div>
            <label className="text-secondary font-semibold text-sm block mb-2">
              <Filter size={16} className="inline mr-1" />
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Tasks</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="in-review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-secondary font-semibold text-sm block mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length > 0 ? (
          <div className="card bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Title
                    </th>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Project
                    </th>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Assigned To
                    </th>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Priority
                    </th>
                    <th className="text-left p-4 font-semibold text-secondary">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b hover:bg-light transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {task.project?.name}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {task.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`badge ${
                            task.status === 'completed'
                              ? 'badge-success'
                              : task.status === 'in-progress'
                              ? 'badge-primary'
                              : task.status === 'in-review'
                              ? 'badge-info'
                              : 'badge-warning'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`badge ${
                            task.priority === 'urgent'
                              ? 'badge-danger'
                              : task.priority === 'high'
                              ? 'badge-danger'
                              : task.priority === 'medium'
                              ? 'badge-warning'
                              : 'badge-primary'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'No date'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card bg-white text-center py-16">
            <ListTodo size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">
              No tasks found
            </h2>
            <p className="text-gray-600">
              {filter !== 'all'
                ? 'No tasks in this status. Try adjusting the filter.'
                : 'Start by creating a new task in a project.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
