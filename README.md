# Task Management System

A full-stack task management application built with **Node.js + Express** backend and **React + Vite** frontend. Features include user authentication (JWT), real-time task CRUD operations, progress tracking, search & filtering, and modern UI with animations.

## 🎯 Features

### Core Features

- ✅ **User Authentication**: Register & Login with JWT tokens
- ✅ **Task CRUD**: Create, Read, Update, Delete tasks
- ✅ **Task Status Tracking**: Pending, In Progress, Completed
- ✅ **Progress Indicator**: Visual progress bar showing % of completed tasks
- ✅ **Search & Filter**: Search tasks by title/description, filter by status
- ✅ **Responsive UI**: Works on desktop and mobile devices
- ✅ **Subtle Animations**: Smooth transitions and hover effects

### Advanced Features

- 🔐 **JWT Authentication**: Secure token-based user sessions
- 📅 **Due Dates**: Set task deadlines with date/time
- 🎨 **Modern UI**: Tailwind CSS with fade-in animations
- 📊 **User-scoped Tasks**: Each user sees only their tasks
- ⚡ **Real-time Updates**: Tasks refresh instantly after changes

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js v22+
- **Framework**: Express.js v5
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **TypeScript**: Full type safety
- **Dev Server**: Nodemon with ts-node/esm

### Frontend

- **Framework**: React v19
- **Build Tool**: Vite v7
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **HTTP**: Fetch API with custom auth headers

## 📋 Requirements Met

### Week 1: Backend Development

- [x] Environment setup (Node.js, Express, MongoDB)
- [x] REST API endpoints (POST, GET, PUT, DELETE /tasks)
- [x] Database schema (Task model with title, description, status, dueDate, user)
- [x] Input validation (validateTask middleware)
- [x] Error handling (graceful error responses with status codes)

### Week 2: Frontend Development

- [x] React project setup (Vite)
- [x] Components (TaskCard, TaskForm/ModelForm, EditModal, TaskList pages)
- [x] API integration (fetch with Bearer token auth)
- [x] CRUD functionality (full create/read/update/delete wiring)
- [x] Styling & responsiveness (Tailwind CSS, grid layout, mobile-friendly)

### Week 3: Advanced Features & Polishing

- [x] User authentication (register/login endpoints, JWT tokens, frontend UI)
- [x] Search functionality (client-side filtering by title/description)
- [x] Status filters (view tasks by status: all, completed)
- [x] Progress tracking (progress bar showing % completed tasks)
- [x] UI polish (animations on modals, cards, buttons)
- [x] Error handling & validation (backend + frontend)

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. **Install dependencies**:

   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file** in `backend/` directory (do NOT commit this file to your repo):

   ```properties
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   PORT=8000
   JWT_SECRET=your-secret-key-change-in-production
   ```

   **Deployment note:** When deploying to a hosting provider (Render, Vercel, Heroku, etc.), set `MONGO_URI`, `PORT`, and `JWT_SECRET` in the platform's environment/secret settings. Avoid committing `.env` to the repository and rotate credentials if secrets are accidentally committed. For Atlas, ensure the service's outbound IPs are included in the Atlas Network Access list or configure VPC peering for production-grade security.

   **Health check:** The server exposes a lightweight health endpoint at `GET /api/health` which returns `{ status: 'ok' | 'error', db: 'connected'|'disconnected'|'connecting'|'disconnecting' }`. Use this endpoint in your platform's readiness/health probes to confirm the server and DB are reachable.

3. **Start dev server**:
   ```bash
   npm run dev
   ```
   - Server runs on `http://localhost:8000`
   - MongoDB connects automatically
   - Nodemon watches for file changes

### Frontend Setup

1. **Install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file** in `frontend/` (optional, defaults to localhost:8000):

   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```
   - Vite dev server runs on `http://localhost:5173`
   - HMR enabled for live reloads

## 📚 API Documentation

### Authentication Routes

#### POST `/api/auth/register`

Register a new user.

**Request**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** (201):

```json
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

#### POST `/api/auth/login`

Login an existing user.

**Request**:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** (200):

```json
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### Task Routes

All task endpoints require `Authorization: Bearer <token>` header.

#### POST `/api/tasks`

Create a new task.

**Request**:

```json
{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "dueDate": "2025-12-01T18:00:00.000Z",
  "status": "pending"
}
```

#### GET `/api/tasks`

Fetch all tasks for authenticated user.

**Response**:

```json
[
  {
    "_id": "...",
    "title": "Buy groceries",
    "description": "Milk, bread, eggs",
    "status": "pending",
    "dueDate": "2025-12-01T18:00:00.000Z",
    "user": "...",
    "createdAt": "2025-11-28T..."
  }
]
```

#### GET `/api/tasks/:id`

Fetch a single task by ID (must own it).

#### PUT `/api/tasks/:id`

Update a task (must own it).

**Request**:

```json
{
  "title": "Buy groceries (updated)",
  "status": "completed"
}
```

#### DELETE `/api/tasks/:id`

Delete a task (must own it).

## 🎨 Frontend Pages

### Login Page

- Email & password input
- Link to create account
- Token-based session management

### Register Page

- Name, email, password inputs
- Auto-login after registration
- Link to login page

### Dashboard

- Task overview with progress indicator
- Create new task button (modal form)
- All user tasks displayed in grid
- Edit & delete buttons per task
- Search bar at top

### Tasks Page

- All non-completed tasks
- Editable inline (edit modal)
- Searchable & deletable
- Same layout as dashboard

### Completed Page

- Filter to show only completed tasks
- Editable (revert status if needed)
- Searchable & deletable

## 🔐 Security

- **Password hashing**: bcrypt with 10 salt rounds
- **JWT tokens**: 7-day expiration
- **User scoping**: Tasks associated with user ID, enforced in controllers
- **Input validation**: Title required, status/date validated
- **CORS enabled**: For development (customize for production)

## 📦 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Express app setup
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── models/
│   │   │   ├── taskModel.ts          # Task schema
│   │   │   └── userModel.ts          # User schema
│   │   ├── controllers/
│   │   │   ├── taskController.ts     # Task CRUD logic
│   │   │   └── authController.ts     # Register/login logic
│   │   ├── routes/
│   │   │   ├── taskRoutes.ts         # Task endpoints
│   │   │   └── authRoutes.ts         # Auth endpoints
│   │   └── middleware/
│   │       ├── auth.ts               # JWT verification
│   │       └── validateTask.ts       # Input validation
│   ├── .env                          # Environment variables
│   ├── tsconfig.json                 # TypeScript config
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx                   # Main app (routes)
    │   ├── main.tsx                  # React entry
    │   ├── index.css                 # Global styles
    │   ├── config.ts                 # API URL config
    │   ├── auth.ts                   # Token/user helpers
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Tasks.tsx
    │   │   └── Completed.tsx
    │   └── components/
    │       ├── Sidebar.tsx
    │       ├── Topbar.tsx
    │       ├── TaskCard.tsx
    │       ├── ModelForm.tsx
    │       ├── EditModal.tsx
    │       └── ProgressIndicator.tsx
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

## 🧪 Testing

### Backend Build & Type Check

```bash
cd backend
npm run build        # Compile TypeScript
```

### Frontend Build

```bash
cd frontend
npm run build        # Build optimized dist/
```

## 🎬 Recording Demo Video

To demonstrate the system:

1. **Open two terminals**:

   - Terminal 1: Start backend (`cd backend && npm run dev`)
   - Terminal 2: Start frontend (`cd frontend && npm run dev`)

2. **Open browser** to `http://localhost:5173`

3. **Record using QuickTime** (macOS):

   - Press `Cmd + Shift + 5` → Select "Record Selection"
   - Perform the following demo steps:
     - Register a new account
     - Login with credentials
     - Create a task with title, description, due date
     - View dashboard progress bar
     - Edit a task (change status to in-progress)
     - Search for a task by keyword
     - Mark task as completed (progress bar updates)
     - Delete a task
     - View Completed page (filter demo)
     - Logout

4. **Save & upload** video to a cloud service (Google Drive, YouTube, etc.)

## 🐛 Troubleshooting

### Backend won't start

- Check `.env` file has valid `MONGO_URI`
- Ensure MongoDB Atlas network access is enabled
- Check `JWT_SECRET` is set (can be any string for dev)

### Frontend fetch errors (401/403)

- Ensure backend is running on port 8000
- Check token is being sent in `Authorization` header
- Try logout and re-login

### Tailwind styles not working

- Run `npm install` in frontend folder
- Restart Vite dev server

## 📝 Notes for Internship Submission

- **Deadline**: November 28, 2025
- **Code Location**: GitHub repository (public)
- **Video**: Demo of full CRUD + auth + search/filter (5-10 min)
- **README**: This file covers all setup and usage

## 🙌 Acknowledgments

- Express.js for robust backend framework
- React & Vite for modern frontend tooling
- Tailwind CSS for styling
- MongoDB for flexible database
- JWT for secure authentication

## 📄 License

ISC

---

**Built with ❤️ by Rafey Umar | Task Manager System**
