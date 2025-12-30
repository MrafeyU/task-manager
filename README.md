# Task Management System

A full-stack task management application built with **Node.js + Express** backend and **React + Vite** frontend. The system evolves over **6 weeks**, starting from core CRUD functionality and ending with collaboration, analytics, and production deployment.

---

## 🎯 Features Overview

### Core Features (Weeks 1–3)

- ✅ User Authentication (JWT)
- ✅ Task CRUD (Create, Read, Update, Delete)
- ✅ Task Status Tracking (Pending, In Progress, Completed)
- ✅ Progress Indicator (% completed tasks)
- ✅ Search & Filter (title, description, status)
- ✅ Responsive UI
- ✅ Animations & UI polish

### Advanced Features (Weeks 4–6)

- 🤝 Task Sharing & Collaboration
- 🔔 Real-Time Notifications
- 📊 Analytics Dashboard
- 🌙 Dark Mode
- 📎 Task Attachments
- 🚀 Production Deployment

---

## 🛠 Tech Stack

### Backend
- Node.js v22+
- Express.js v5
- MongoDB (Atlas)
- JWT Authentication
- bcrypt (password hashing)
- Socket.IO (real-time notifications)
- TypeScript

### Frontend
- React v19
- Vite v7
- Tailwind CSS v4
- Chart.js / Recharts
- TypeScript

---

## 📅 Project Timeline & Requirements

---

## 🗓 Week 1 – Backend Development

### Objective  
Build a secure and scalable REST API.

### Tasks
- Environment setup (Node.js, Express, MongoDB)
- REST API for tasks
- MongoDB schemas (User, Task)
- Input validation middleware
- Centralized error handling

### Deliverables
- Functional backend APIs
- MongoDB integration
- Code committed to GitHub

---

## 🗓 Week 2 – Frontend Development

### Objective  
Build a responsive frontend and integrate APIs.

### Tasks
- React + Vite setup
- Authentication pages (Login/Register)
- Task CRUD UI
- API integration using Fetch
- Responsive Tailwind layouts

### Deliverables
- Fully functional frontend
- Task CRUD working end-to-end

---

## 🗓 Week 3 – Advanced Features & Polishing

### Objective  
Enhance usability and add quality-of-life features.

### Tasks
- JWT-based authentication flow
- Search & filtering
- Progress tracking
- UI animations
- Error handling (frontend + backend)

### Deliverables
- Polished UI
- Secure user-scoped tasks
- Stable CRUD system

---

## 🗓 Week 4 – Collaborative Features & Real-Time Notifications

### Objective  
Enable multi-user collaboration and real-time interaction.

### Tasks

#### 1. User Collaboration
- Updated task schema:
  - `owner`
  - `sharedWith` (array of user IDs)
- New API endpoints:
  - `PUT /api/tasks/:id/share`
  - `GET /api/tasks/shared`
- Authorization checks for owners/shared users

#### 2. Real-Time Notifications
- Implemented using **Socket.IO**
- Notifications triggered when:
  - Task is shared
  - Task status is updated
- Notifications stored in database

#### 3. Frontend Integration
- Share Task button added
- Notification sidebar / popups
- Real-time UI updates

#### 4. Testing & Error Handling
- Prevent unauthorized sharing
- Handle invalid users gracefully

### Deliverables
- Task sharing functionality
- Real-time notifications
- Updated schema & APIs
- Code pushed to GitHub

---

## 🗓 Week 5 – Advanced Analytics & Reporting

### Objective  
Provide insights into task performance through analytics.

### Tasks

#### 1. Analytics Dashboard
- Total tasks (created, completed, pending)
- Status breakdown (pie chart)
- Weekly/monthly trends

#### 2. Backend Enhancements
- New endpoints:
  - `GET /api/analytics/overview`
  - `GET /api/analytics/trends`
- MongoDB Aggregation Framework used

#### 3. Frontend Integration
- Dynamic charts using Chart.js / Recharts
- Responsive dashboard UI

#### 4. Data Optimization
- Optimized aggregation queries
- Indexed fields
- Reduced payload size

### Deliverables
- Analytics dashboard
- Optimized backend queries
- Dashboard screenshots on GitHub

---

## 🗓 Week 6 – Deployment, Documentation & Final Enhancements

### Objective  
Prepare the system for production and final submission.

### Tasks

#### 1. Deployment
- Deployed using Render / Vercel / Heroku
- Single live URL for frontend & backend
- Environment variables secured

#### 2. Final Enhancements
- Dark mode toggle
- Task attachments (images/files)
- Improved mobile responsiveness

#### 3. Documentation
- Complete README
- API documentation
- Screenshots & feature explanations

#### 4. Testing
- End-to-end testing
- Bug fixes
- Cross-browser & mobile testing

### Deliverables
- Live deployed project
- Dark mode & attachments
- Final README
- Video walkthrough

---

## 🧾 Evaluation Criteria

1. Feature Implementation  
2. Performance & Optimization  
3. Documentation Quality  
4. Deployment Stability  

---

## ⏰ Final Deadline

**30th December, 2025 – 11:59 PM (PKT)**  

All deliverables must be submitted via **GitHub**, including:
- Public repository
- Live deployed URL
- Video walkthrough

---

**Built with ❤️ by Rafey Umar | Task Management System**
