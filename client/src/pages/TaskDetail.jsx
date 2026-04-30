import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { ArrowLeft, Trash2, MessageCircle } from 'lucide-react';

export const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getById(id);
      setTask(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      setError('Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await taskAPI.update(id, { status: newStatus });
      setTask(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        navigate(`/projects/${task.project._id}`);
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setUpdating(true);
      const response = await taskAPI.addComment(id, { text: comment });
      setTask(response.data.data);
      setFormData(response.data.data);
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setUpdating(false);
    }
  };

  const getCommentAuthorName = (user) => {
    if (user && typeof user === 'object' && user.name) {
      return user.name;
    }

    return 'Unknown user';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-light p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="card bg-white text-center py-12">
            <p className="text-danger">Task not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/projects/${task.project._id}`)}
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          Back to Project
        </button>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger rounded-lg text-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Task Header */}
            <div className="card bg-white mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-secondary">{task.title}</h1>
                  <p className="text-gray-600 mt-2">{task.description}</p>
                </div>
                <button
                  onClick={handleDeleteTask}
                  className="p-2 hover:bg-danger/10 rounded-lg transition-colors text-danger"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 pt-4 border-t flex-wrap">
                {['todo', 'in-progress', 'in-review', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      task.status === status
                        ? 'bg-primary text-white'
                        : 'bg-light text-secondary hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="card bg-white">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <MessageCircle size={24} />
                Comments
              </h3>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="mb-6 pb-6 border-b">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows="3"
                  className="input-field mb-2"
                ></textarea>
                <button
                  type="submit"
                  disabled={updating || !comment.trim()}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Adding...' : 'Add Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((c, idx) => (
                    <div key={idx} className="p-4 bg-light rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                          {getCommentAuthorName(c.user).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary">
                            {getCommentAuthorName(c.user)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No comments yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Info Card */}
            <div className="card bg-white">
              <h4 className="font-bold text-secondary mb-4">Details</h4>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Project</p>
                  <p className="text-secondary font-semibold mt-1">
                    {task.project?.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold">Status</p>
                  <span className={`badge mt-2 ${
                    task.status === 'completed'
                      ? 'badge-success'
                      : task.status === 'in-progress'
                      ? 'badge-primary'
                      : 'badge-warning'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold">Priority</p>
                  <span className={`badge mt-2 ${
                    task.priority === 'high' || task.priority === 'urgent'
                      ? 'badge-danger'
                      : task.priority === 'medium'
                      ? 'badge-warning'
                      : 'badge-primary'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Assigned To
                  </p>
                  <p className="text-secondary font-semibold mt-1">
                    {task.assignedTo?.name || 'Unassigned'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold">Due Date</p>
                  <p className="text-secondary font-semibold mt-1">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No date'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm font-semibold">Created By</p>
                  <p className="text-secondary font-semibold mt-1">
                    {task.createdBy?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Tracking */}
            <div className="card bg-white">
              <h4 className="font-bold text-secondary mb-4">Time</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Estimated Hours</p>
                  <p className="text-2xl font-bold text-primary">
                    {task.estimatedHours || 0}h
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Actual Hours</p>
                  <p className="text-2xl font-bold text-secondary">
                    {task.actualHours || 0}h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
