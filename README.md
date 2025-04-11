# 🚀 HireMind

**Job Application Tracker + Analytics + Tools**  
Built with a full-stack architecture using modern web technologies and best practices.

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, ShadCN UI, React Router
- **Backend**: Django REST Framework, PostgreSQL, Redis
- **Authentication**: Django `session` authentication with CSRF protection
- **AI**: Google Gemini API for cover letter generation
- **DevOps**: Docker, Docker Compose, AWS S3 for file storage

---

## 📦 Features

- 🎯 Track job applications (save, edit, delete, attach resumes)
- 🔎 Filter/search by status, company, position
- 🧠 Generate AI-powered cover letters
- 💾 Save and manage your cover letters
- 📊 Dashboard + contacts tracker
- 🔐 Full session-based auth with secure cookie and CSRF support

---

## 🔒 Authentication Overview

HireMind uses **session-based authentication** powered by Django’s `django.contrib.auth`. Here's how it works:

- When you log in or register, the backend sets a secure HTTP-only session cookie.
- CSRF tokens are required and managed using `@csrf_protect`, `@ensure_csrf_cookie`, and frontend cookie fetching.
- React accesses user info using `GET /api/user/` and controls app state accordingly.
- Protected endpoints require the session cookie and CSRF token.

---

## 🧑‍💻 Local Development

### ⚡️ Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- PostgreSQL (if not using Docker)
- Redis (if not using Docker)
- [Docker](https://www.docker.com/) + Docker Compose (recommended)

---

### 🚀 Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/hiremind.git
cd hiremind

# Start everything
docker-compose up --build


# Start everything
docker-compose up --build
```
##cat
