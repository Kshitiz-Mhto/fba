<div align="center">
  <img src="./public/assets/craft_full_logo_bgblack.png" 
      alt="Craft Logo" 
      width="200" 
      style="margin-bottom: 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.25);">
</div>

Craft is a modern, premium form builder designed for creating surveys, quizzes, and data collection forms with ease. It offers a focused, distraction-free environment for both form creators and respondents.

## 🚀 Features

- **Intuitive Form Builder**: Drag-and-drop interface for building complex forms.
- **Real-time Preview**: See exactly how your form looks before publishing.
- **Submission Management**: Comprehensive dashboard to view and analyze responses.
- **Admin Control**: Robust admin panel for managing users and global form settings.
- **Secure Authentication**: Integrated with Supabase for secure Email/Password and Google OAuth.
- **RBAC**: Role-Based Access Control to manage permissions across the platform.
- **Responsive Design**: Fully responsive interface for a seamless experience on all devices.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Go (1.25+), Fiber v3.
- **Database & Auth**: Supabase (PostgreSQL, GoTrue).

## 📦 Database Schema

<div align="center">
  <img src="./public/assets/db.png" 
      alt="Supabase Database Schema" 
      width="700" 
      style="margin-bottom: 2rem; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.25);">
</div>

---

## ⚙️ Setup Guide

### Prerequisites

- [Go](https://golang.org/doc/install) (v1.25 or later)
- [Node.js](https://nodejs.org/en/download/) (v18 or later)
- [Supabase Account](https://supabase.com/)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd craft-backend
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in the `.env` file:
   - `PUBLISH_KEY`
   - `SECRET_KEY`
   - `ANON_KEY`
   - `DATABASE_URL`
   - `PROJECT_URL`

4. Run the backend:
   ```bash
   make run
   # Or for hot reload (requires 'air'):
   make watch
   ```

### 2. Frontend Setup

1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the following:
   - `CALLBACK_URL` (e.g., http://localhost:5173/auth/callback)
   - `CLIENT_ID` (Google OAuth Client ID)
   - `CLIENT_SECRET` (Google OAuth Client Secret)
   - `VITE_API_BASE_URL` (e.g., http://localhost:8080/api/v1)

4. Run the frontend:
   ```bash
   npm run dev
   ```

---
