import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectAPI, taskAPI } from '../services/api';
import { ArrowLeft, Plus, Users, Trash2, Edit2 } from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes, statsRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getAll({ projectId: id }),
        taskAPI.getStats(id),
      ]);

      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      setError('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure? This will delete all tasks in this project.')) {
      try {
        await projectAPI.delete(id);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-light p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>
          <div className="card bg-white text-center py-12">
            <p className="text-danger">Project not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg text-danger">
            {error}
          </div>
        )}

        {/* Project Header */}
        <div className="card bg-white mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-secondary">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/projects/${id}/edit`}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={20} />
              </Link>
              <button
                onClick={handleDeleteProject}
                className="p-2 hover:bg-danger/10 rounded-lg transition-colors text-danger"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Status</p>
              <span className={`badge mt-2 ${
                project.status === 'active'
                  ? 'badge-success'
                  : 'badge-warning'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Priority</p>
              <span className={`badge mt-2 ${
                project.priority === 'high'
                  ? 'badge-danger'
                  : project.priority === 'medium'
                  ? 'badge-warning'
                  : 'badge-primary'
              }`}>
                {project.priority}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Members</p>
              <p className="text-2xl font-bold text-secondary mt-1">
                {project.members.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold">Created</p>
              <p className="text-sm text-secondary mt-1">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-white">
              <p className="text-gray-600 text-sm font-semibold">Total Tasks</p>
              <p className="text-3xl font-bold text-secondary mt-1">{stats.total}</p>
            </div>
            <div className="card bg-white">
              <p className="text-gray-600 text-sm font-semibold">To Do</p>
              <p className="text-3xl font-bold text-info mt-1">{stats.todo}</p>
            </div>
            <div className="card bg-white">
              <p className="text-gray-600 text-sm font-semibold">In Progress</p>
              <p className="text-3xl font-bold text-warning mt-1">
                {stats.inProgress}
              </p>
            </div>
            <div className="card bg-white">
              <p className="text-gray-600 text-sm font-semibold">Completed</p>
              <p className="text-3xl font-bold text-success mt-1">
                {stats.completed}
              </p>
            </div>
          </div>
        )}

        {/* Team Members */}
        <div className="card bg-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Users size={24} />
              Team Members
            </h2>
            <Link
              to={`/projects/${id}/add-member`}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Member
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.members.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center justify-between p-4 bg-light rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {member.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">
                      {member.user.name}
                    </p>
                    <p className="text-xs text-gray-600">{member.user.email}</p>
                  </div>
                </div>
                <span className="badge badge-primary">{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-secondary">Tasks</h2>
            <Link
              to={`/projects/${id}/create-task`}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              New Task
            </Link>
          </div>

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
                        Assigned To
                      </th>
                      <th className="text-left p-4 font-semibold text-secondary">
                        Status
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
                          {task.assignedTo?.name || 'Unassigned'}
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
              <p className="text-gray-600 mb-4">No tasks in this project yet</p>
              <Link
                to={`/projects/${id}/create-task`}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Task
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
