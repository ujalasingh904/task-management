# Team Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) application for team collaboration, project management, and task tracking with role-based access control.

## Features

### Core Features
- **User Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create, update, and manage projects
- **Task Management**: Create, assign, and track tasks with multiple statuses
- **Team Collaboration**: Add team members to projects with different roles
- **Dashboard**: Real-time statistics and overview of tasks and projects
- **Task Tracking**: Multiple status levels (Todo, In Progress, In Review, Completed)
- **Comments**: Add comments to tasks for team discussions
- **Role-Based Access Control**: Admin and Member roles with different permissions

### UI/UX Features
- Modern, responsive design using Tailwind CSS
- Beautiful gradient themes and smooth animations
- Interactive components with Lucide React icons
- Mobile-friendly interface
- Real-time loading states and error handling
- Color-coded badges for status, priority, and role

## Tech Stack

### Frontend
- **React 18.2**: UI library
- **React Router**: Navigation
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Lucide React**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## Project Structure

```
team-task-manager/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   └── Tasks.jsx
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/                # API services
│   │   │   └── api.js
│   │   ├── App.jsx                  # Main component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── package.json                 # Dependencies
│
├── server/                          # Backend Node.js application
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Team.js
│   ├── controllers/                 # Request handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   └── auth.js
│   ├── server.js                    # Main server file
│   ├── package.json                 # Dependencies
│   └── .env.example                 # Environment variables template
│
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn or pnpm
- MongoDB (local or cloud - MongoDB Atlas)

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`**
   ```
   MONGODB_URI=mongodb://localhost:27017/team-task-manager
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key_here
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

   **For MongoDB Atlas (Cloud):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
   ```

5. **Start the server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory** (in a new terminal)
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Frontend will run on `http://localhost:5173`

## Usage

### Getting Started

1. **Open the application**
   - Navigate to `http://localhost:5173` in your browser

2. **Create an account**
   - Click "Create an account" on the login page
   - Fill in your name, email, and password
   - Click "Sign Up"

3. **Login**
   - Enter your email and password
   - Click "Login"

### Demo Credentials

For testing purposes, you can use:
- **Email**: demo@example.com
- **Password**: password123

(Create this user first through the registration page)

### Core Features Usage

#### Dashboard
- View overview of all your projects and tasks
- See task statistics (total, in progress, completed, overdue)
- Quick access to recent tasks
- Create new projects

#### Projects
- **View Projects**: See all projects you're involved in
- **Create Project**: Click "New Project" and fill in details
- **Edit Project**: Update project information
- **Delete Project**: Remove a project (admin only)
- **Add Members**: Invite team members to projects

#### Tasks
- **Create Task**: Create tasks within a project
- **Assign Tasks**: Assign tasks to team members
- **Update Status**: Change task status (Todo → In Progress → In Review → Completed)
- **Track Progress**: Set estimated and actual hours
- **Add Comments**: Collaborate with team members
- **Add Tags**: Categorize tasks with custom tags

#### Team Collaboration
- Add team members to projects
- Assign specific roles (Admin/Member)
- Comment on tasks for discussions
- Track task progress with multiple status levels

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/members` - Add member (protected)
- `DELETE /api/projects/:id/members/:userId` - Remove member (protected)

### Tasks
- `GET /api/tasks` - Get all tasks with filters (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `POST /api/tasks/:id/comments` - Add comment (protected)
- `GET /api/tasks/stats/:projectId` - Get task statistics (protected)

## Role-Based Access Control

### Admin Role
- Create and delete projects
- Add/remove team members
- Delete tasks
- Full access to all project features

### Member Role
- View projects
- Create and update tasks assigned to them
- Add comments
- Limited access based on project membership

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  avatar: String,
  isActive: Boolean,
  timestamps: true
}
```

### Project
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [{user, role, joinedAt}],
  status: String (active/archived/completed),
  startDate: Date,
  endDate: Date,
  priority: String (low/medium/high),
  timestamps: true
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  status: String (todo/in-progress/in-review/completed),
  priority: String (low/medium/high/urgent),
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  comments: [{user, text, createdAt}],
  tags: [String],
  timestamps: true
}
```

## Deployment

### Deploying Frontend to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project" and select your repository
4. Set environment variables (VITE_API_URL)
5. Deploy

### Deploying Backend to Render/Heroku

1. Push your code to GitHub
2. Go to https://render.com or https://heroku.com
3. Create new Web Service
4. Connect your GitHub repository
5. Set environment variables (MongoDB URI, JWT_SECRET, etc.)
6. Deploy

### Deploying MongoDB to MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in your backend `.env`

## Error Handling

The application includes comprehensive error handling:
- Validation of user inputs
- JWT token verification
- Database operation error handling
- HTTP status codes for different error types
- User-friendly error messages

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes on frontend and backend
- Input validation and sanitization
- CORS configuration
- Secure HTTP headers

## Performance Optimization

- Lazy loading of routes
- Efficient database queries with populate
- Client-side caching with local storage
- CSS optimization with Tailwind
- Minified production builds

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check `MONGODB_URI` in `.env`
- Verify network access is allowed (for Atlas)

### CORS Error
- Ensure backend is running on correct port
- Check `FRONTEND_URL` in backend `.env`
- Verify API endpoints in frontend are correct

### 404 API Errors
- Make sure backend server is running
- Check API endpoint paths are correct
- Verify request methods (GET, POST, etc.)

### Token Expiration
- Clear browser cache and localStorage
- Login again to get new token
- Token expires after 30 days

## Future Enhancements

- Real-time notifications
- File uploads and attachments
- Email notifications
- Task templates
- Advanced reporting and analytics
- Calendar view for tasks
- Team activity logs
- Task dependencies
- Bulk operations
- Mobile app

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository or contact the development team.

---

**Happy Task Managing! 🚀**
