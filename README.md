# techNotes

**techNotes** is a task management application designed for companies to organize tasks in a structured way. It supports role-based access control for Admins, Managers, and Employees

## [Check Out the App](https://basel-tech-notes.vercel.app)

## Table Of Contents

- [Features](#features)
- [Installation](#installation)
- [Roles & Permissions](#roles--permissions)
- [Tech Stack](#tech-stack)
- [Contact](#contact)

## Features

- **User Management**: Admins and Managers can create, update, and delete users.
- **Note Management**: Create, update, and delete notes. Assign notes to users.
- **Role-Based Access Control (RBAC)**: Different roles (Admin, Manager, Employee) with specific permissions.
- **Authentication**: Secure login system using tokens.
- **Task Assignment**: Assign notes to users and track their completion status.

## Installation

Before proceeding with the backend installation, please make sure you have installed the frontend. You can find the installation guide for the frontend [here](https://github.com/Basel-01/tech-notes-client/blob/main/README.md#installation).

### Backend Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/Basel-01/tech-notes-api.git
   cd tech-notes-api
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Set up environment variables. Create a .env file in the root directory. take a look at example.env.

4. Start the server.
   ```bash
   npm run dev
   ```

## Roles & Permissions

In this application, there are three main roles: Admin, Manager, and Employee. Each role has specific permissions for managing users and notes, users can have more than one role.

Below is a detailed breakdown of the permissions for each role:

### 1. Admin

The Admin has the highest level of access and can perform the following actions:

- **Users:**

  - Retrieve all users with all roles.
  - Create new users with the role of Admin, Manager, or Employee.
  - Update existing users with the role of Admin, Manager, or Employee.
  - Delete users with the role of Admin, Manager, or Employee.

- **Notes:**
  - Retrieve all notes.
  - Create notes and assign them to any role, except other admin (notes cannot be assigned to admins).
  - Update any note.
  - Delete any note.

**Note:** Admins cannot be assigned to any notes. However, if a user has both Admin and Employee roles, they can be assigned to a note as an Employee.

---

### 2. Manager

The Manager has restricted access compared to the Admin and can perform the following actions:

- **Users:**

  - Retrieve all users with all roles.
  - Create new users with the role of Employee only.
  - Update users with the role of Employee only.
  - Delete users with the role of Employee only.

- **Notes:**
  - Retrieve all notes.
  - Create notes and assign them to any role, except admin.
  - Update notes that the Manager has created or has been assigned to.
  - Delete only the notes that the Manager has created.

---

### 3. Employee

The Employee has the least access and can perform the following actions:

- **Users:**

  - Cannot retrieve users.
  - Cannot create, update, or delete users.

- **Notes:**
  - Retrieve all notes.
  - Cannot create new notes.
  - Update only the status (e.g., mark as completed or open) of notes assigned to them.
  - Cannot delete notes.

---

### Multiple Roles

If a user is assigned more than one role, they inherit all the permissions of each role they hold. For example:

- A user with both **Admin** and **Employee** roles can be assigned to a note as an Employee, while also retaining the ability to create, update, and delete users as an Admin.

Make sure to test according to the combined permissions for users with multiple roles.

## Tech Stack

- **Frontend**: React (Vite) with Redux Toolkit Query for state management
- **Backend**: Express.js with Mongoose for MongoDB
- **Authentication**: JWT (Access and Refresh Tokens)
- **Deployment**: Vercel (Frontend & Backend)

## Contact

For questions or support, please contact basel.lo0o87@gmail.com
