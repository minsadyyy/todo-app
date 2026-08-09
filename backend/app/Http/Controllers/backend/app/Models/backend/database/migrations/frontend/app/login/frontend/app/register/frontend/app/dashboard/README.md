# Full-Stack Todo Web Application

A modern, production-ready Todo Web Application built with **Next.js (Frontend)**, **Laravel (Backend API)**, and **PostgreSQL (Database)**.

---

## Features

### 1. Authentication Module
- **User Registration:** Secure user sign-up with password hashing.
- **User Login:** Sanctum-token-based authentication.
- **Logout:** Token revocation on logout.
- **Protected Routes:** Endpoints secured via Laravel Sanctum middleware.
- **Validation & Error Handling:** Proper field validation and HTTP error response structures.
- **Responsive UI:** Styled using Tailwind CSS.

### 2. Todo Management Module
- **Create Todos:** Add new tasks with title and optional description.
- **Edit Todos:** Update existing todo details.
- **Delete Todos:** Permanently remove tasks.
- **Status Toggle:** Mark tasks as completed or pending.
- **Search:** Search tasks by title or description in real time.
- **Filter:** Filter tasks by status (`All`, `Pending`, `Completed`).

---

## Tech Stack & Architecture

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Axios
- **Backend:** Laravel 11 REST API, Laravel Sanctum
- **Database:** PostgreSQL

---

## Project Structure

todo-app/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   └── TodoController.php
│   │   └── Models/
│   │       └── Todo.php
│   ├── database/migrations/
│   │   └── 2026_01_01_000000_create_todos_table.php
│   └── routes/
│       └── api.php
└── frontend/
├── app/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/page.tsx
└── lib/
└── api.ts


api.ts


---

## ⚙️ Setup & Installation Instructions

### Backend (Laravel) Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
Configure PostgreSQL database in .env:
Code snippet
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=todo_app
DB_USERNAME=postgres
DB_PASSWORD=your_password
Run migrations:
Bash
php artisan migrate
Start the backend server:
Bash
php artisan serve
Frontend (Next.js) Setup
Navigate to the frontend directory:
Bash
cd frontend
npm install
Start the development server:
Bash
npm run dev
Open http://localhost:3000 in your browser.
