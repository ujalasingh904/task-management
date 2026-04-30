import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { Plus, Folder, Users, Calendar, Trash2 } from 'lucide-react';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        setProjects(projects.filter((p) => p._id !== id));
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

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-secondary">Projects</h1>
            <p className="text-gray-600 mt-2">Manage all your projects in one place</p>
          </div>
          <Link
            to="/create-project"
            className="flex items-center gap-2 btn btn-primary"
          >
            <Plus size={20} />
            New Project
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg text-danger">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="card bg-white hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Folder size={24} className="text-primary" />
                    </div>
                    <div>
                      <Link
                        to={`/projects/${project._id}`}
                        className="font-bold text-lg text-secondary hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 hover:bg-danger/10 rounded-lg transition-colors text-danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>

                {/* Project Info */}
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {project.members.length} members
                    </span>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">
                        Due {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`badge ${
                      project.status === 'active'
                        ? 'badge-success'
                        : project.status === 'completed'
                        ? 'badge-primary'
                        : 'badge-warning'
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-primary hover:underline text-sm font-semibold"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-white text-center py-16">
            <Folder size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-secondary mb-2">
              No projects yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by creating your first project to organize your tasks
            </p>
            <Link
              to="/create-project"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
