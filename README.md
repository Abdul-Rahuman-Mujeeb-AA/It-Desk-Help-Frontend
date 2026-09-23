# IT Help Desk

A full-stack IT Help Desk ticket management system built with **React, Tailwind CSS, Node.js, Express.js, MongoDB, and JWT authentication**.

The application allows users to create and manage support tickets, while administrators can manage users, tickets, statuses, priorities, and support activities.

---

## Features

### User Features

* User registration
* User login
* JWT authentication
* User profile management
* Profile image upload
* Password change
* Account deletion
* Create support tickets
* Add ticket attachments
* View personal tickets
* View ticket details
* Track ticket status
* Search and filter tickets
* Responsive dashboard

### Admin Features

* Admin authentication
* Admin dashboard
* View system statistics
* Manage users
* Manage tickets
* Create tickets
* Edit tickets
* Delete tickets
* View ticket details
* Update ticket status
* Manage ticket priority
* Manage ticket category
* View recent users
* View recent tickets
* Search and filter tickets
* Responsive admin interface

### Responsive Design

The application is designed for:

* Mobile
* Tablet
* Desktop
* Large desktop screens

---

## Technology Stack

### Frontend

* React
* React Router
* Tailwind CSS
* Axios
* React Icons
* React Hot Toast
* Recharts
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* CORS
* dotenv

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

```text
IT-Help-Desk/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Ticket.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   ├── adminService.js
│   │   ├── authService.js
│   │   └── ticketService.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │
│   │   ├── components/
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TicketCard.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   ├── TicketStatus.jsx
│   │   │   └── UserTable.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageTickets.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── TicketDetails.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AppRoutes.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── ticketService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md
```

---

# Backend Setup 

## 1. Navigate to Backend

```bash
cd backend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

---

## 4. Start Backend Development Server

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend will run locally at:

```text
http://localhost:5000
```

---

# Frontend Setup

## 1. Navigate to Frontend

```bash
cd frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variable

Create `.env` in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

For the deployed production frontend:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 4. Start Frontend

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# API Configuration

The frontend uses Axios to communicate with the backend.

Production API:

```text
https://your-backend.onrender.com/api
```

The frontend API configuration is located at:

```text
frontend/src/services/api.js
```

Example:

```js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://your-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

---

# Authentication API

## Register

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

# Main API Routes

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Users

```text
GET    /api/users
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/password
DELETE /api/users/account
```

## Tickets

```text
POST   /api/tickets
GET    /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
DELETE /api/tickets/:id
```

## Admin

```text
GET    /api/admin/users
GET    /api/admin/tickets
```

> The exact available endpoints depend on the route/controller implementation in the backend.

---

# Ticket Management

A ticket can contain information such as:

```text
Title
Description
Category
Priority
Status
Created By
Assigned User
Attachment
Created Date
Updated Date
```

Typical ticket statuses include:

```text
Pending
In Progress
Completed
```

Typical priorities include:

```text
Low
Medium
High
```

---

# File Uploads

The backend provides an uploads directory:

```text
backend/uploads/
```

Uploaded files are served through:

```text
/uploads
```

For example:

```text
https://your-backend.onrender.com/uploads/example.jpg
```

The application supports uploads for profile images and ticket attachments.

### Production Storage

Render's local filesystem should not be treated as permanent storage for uploaded files.

For production, consider using an object-storage service such as:

* Cloudinary
* Amazon S3
* Cloudflare R2
* Supabase Storage

---

# CORS Configuration

The deployed frontend is hosted on Vercel:

```text
https://your-frontend.vercel.app
```

The backend allows requests from the frontend.

Example:

```js
const corsOptions = {
  origin: "https://it-desk-help-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
```

If the Vercel domain changes, update the backend CORS configuration accordingly.

---

# Vercel Deployment

## 1. Build Frontend

From the frontend folder:

```bash
npm run build
```

The production build is generated in:

```text
dist/
```

## 2. Vercel Configuration

The project contains:

```text
vercel.json
```

Example:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This allows React Router routes to work correctly on Vercel.

## 3. Vercel Environment Variable

Add:

VITE_API_URL

Value:

https://your-backend.onrender.com/api

Select the appropriate deployment environments, especially **Production**.

After changing a Vite environment variable, redeploy the frontend because Vite injects environment variables during the build.

---

# Render Deployment

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

Author:
Mr. Abdul Rahuman Mujeeb || @2026 All Rights Reserved Me

