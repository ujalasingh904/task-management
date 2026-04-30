import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        projectAPI.getAll(),
        taskAPI.getAll({ limit: 5 }),
      ]);

      setProjects(projectsRes.data.data);
      setTasks(tasksRes.data.data);

       
      const allTasks = tasksRes.data.data;
      const statsData = {
        total: allTasks.length,
        completed: allTasks.filter((t) => t.status === 'completed').length,
        inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
        overdue: allTasks.filter(
          (t) => new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length,
      };
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
         
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your tasks.</p>
        </div>

         
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Total Tasks</p>
                  <p className="text-3xl font-bold text-secondary mt-1">
                    {stats.total}
                  </p>
                </div>
                <TrendingUp size={32} className="text-primary" />
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">In Progress</p>
                  <p className="text-3xl font-bold text-info mt-1">
                    {stats.inProgress}
                  </p>
                </div>
                <Clock size={32} className="text-info" />
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Completed</p>
                  <p className="text-3xl font-bold text-success mt-1">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle size={32} className="text-success" />
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Overdue</p>
                  <p className="text-3xl font-bold text-danger mt-1">
                    {stats.overdue}
                  </p>
                </div>
                <AlertCircle size={32} className="text-danger" />
              </div>
            </div>
          </div>
        )}

         
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary">Your Projects</h2>
            <Link
              to="/create-project"
              className="flex items-center gap-2 btn btn-primary"
            >
              <Plus size={20} />
              New Project
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="card bg-white hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Folder size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary">{project.name}</h3>
                        <p className="text-xs text-gray-500">
                          {project.members.length} members
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${
                      project.status === 'active'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description || 'No description'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card bg-white text-center py-12">
              <Folder size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Link
                to="/create-project"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create your first project
              </Link>
            </div>
          )}
        </div>

         
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary">Recent Tasks</h2>
            <Link to="/tasks" className="text-primary hover:underline text-sm font-semibold">
              View all
            </Link>
          </div>

          {tasks.length > 0 ? (
            <div className="card bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-light border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-secondary">Title</th>
                      <th className="text-left p-4 font-semibold text-secondary">Project</th>
                      <th className="text-left p-4 font-semibold text-secondary">Status</th>
                      <th className="text-left p-4 font-semibold text-secondary">Priority</th>
                      <th className="text-left p-4 font-semibold text-secondary">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b hover:bg-light transition-colors"
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
                        <td className="p-4">
                          <span
                            className={`badge ${
                              task.status === 'completed'
                                ? 'badge-success'
                                : task.status === 'in-progress'
                                ? 'badge-primary'
                                : 'badge-warning'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`badge ${
                              task.priority === 'high' || task.priority === 'urgent'
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
            <div className="card bg-white text-center py-12">
              <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No tasks yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
