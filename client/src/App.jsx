import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

 
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { CreateProject } from './pages/CreateProject';
import { CreateTask } from './pages/CreateTask';
import { TaskDetail } from './pages/TaskDetail';
import { Tasks } from './pages/Tasks';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
           
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

           
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Projects />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <ProjectDetail />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <CreateProject />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:projectId/create-task"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <CreateTask />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Tasks />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <TaskDetail />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
