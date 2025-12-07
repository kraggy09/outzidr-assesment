# Project Phoenix - Collaborative Kanban Board

## Overview

A powerful, real-time collaborative task management application built with the MERN stack. It features seamless drag-and-drop task management, live updates via Socket.io, and role-based access control.

## Key Features

- **Full Stack Architecture**: MongoDB, Express, React, Node.js (TypeScript).
- **Real-Time Collaboration**: Instant updates across all connected clients using Socket.io.
- **Interactive UI**: Smooth drag-and-drop experience powered by `@hello-pangea/dnd`.
- **Role-Based Access Control (RBAC)**:
  - **Editor**: Full access to create, edit, delete, and move cards.
  - **Viewer**: Read-only access to view the board and real-time updates.
- **Guest Access**: Quick "Login as Guest" feature for instant view-only access without registration.
- **Security**:
  - JWT-based authentication.
  - Protected API routes via middleware.
  - Socket connection scoping (only designated to authenticated users).
- **Theming**: Built-in Dark and Light mode support.

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone and Install Server Dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**

   ```bash
   cd client
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the `server` directory:
     ```
     PORT=4000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Client**
   ```bash
   cd client
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## Future Improvements & Roadmap

To evolve Project Phoenix into an enterprise-grade solution, we have identified several key architectural and feature improvements:

### 1. Enhanced Security Level (HttpOnly Cookies)

- **Current State**: JWT tokens are currently stored in the browser's `localStorage`.
- **Proposed Improvement**: Migrate authentication to use **HttpOnly Cookies**.
- **Benefit**: Storing tokens in HttpOnly cookies prevents client-side JavaScript from accessing them. This drastically reduces the risk of **XSS (Cross-Site Scripting)** attacks and token theft, offering a much higher security standard than local storage.

### 2. Team & Organization Management

- **Current State**: Users exist independently.
- **Proposed Improvement**: Introduce a **Teams** layer.
  - Users can create organizations or teams.
  - Users can invite others to their team via email.
  - Boards belong to teams rather than being global or single-user.

### 3. Advanced Roles & Granular Permissions

- **Current State**: System supports `Editor` (Read/Write) and `Viewer` (Read-only).
- **Proposed Improvement**: Implement a comprehensive permission matrix with advanced roles:
  - **Project Owner**: Access to billing, potential deletion of projects, and critical settings.
  - **Team Lead**: Ability to manage members, assign roles, and create new boards.
  - **Member**: Standard task management (Move/Edit/Create cards).
  - **Observer**: Strict read-only access (Stakeholders).
  - **Guest**: Temporary restrictions for external users.

### 4. Multi-Board Support

- Refactor the database schema to support multiple boards per user/team, allowing for better segregation of different projects.

### 5. Audit Logging

- Implement an activity log to track "Who did what and when" (e.g., _User A moved Card X from To Do to Done_), which is essential for team accountability.
