# 🎓 CollegeFinder — Full-Stack College Discovery & Predictor Platform

A modern, production-grade web application built to empower students in discovering, comparing, and predicting college admissions across India's top engineering and higher education institutes.

---

## 🌟 Key Features

1. **Intelligent College Discovery**:
   - Advanced multi-criteria search by college name, city, state, or course.
   - Dynamic fee filter (< 2L, >= 2L), NIRF ranking sort, and CTC package sorting.
   - High-definition campus imagery, NIRF ranking badges, and instant bookmarking.

2. **Smart Admissions Predictor Engine**:
   - Evaluates entered entrance exam ranks (JEE Main, JEE Advanced, BITSAT, WBJEE, MET, VITEEE, etc.) against historical database closing cutoffs.
   - Categorizes recommendations into **Safe Choices (80-96% probability)**, **Target Choices (55-80%)**, and **Reach / Dream Choices (25-50%)**.
   - Filters by seat categories (General, OBC, SC, ST, EWS) and preferred engineering branches.

3. **Multi-College Comparison Matrix**:
   - Side-by-side comparison of up to 4 colleges.
   - Real-time evaluation of NIRF rank, annual tuition fees, average & highest CTC packages, placement rates, ratings, and facilities.
   - Automatic highlighting for "Best Value", "Highest Average CTC", and "Top Placement".

4. **Community Discussion Forum (Q&A)**:
   - Topic tagging (Admissions, Cutoffs, Placements, Fees, Hostel, Scholarships).
   - Upvoting system and threaded community answers with student attribution.

5. **Verified Student Reviews & Rating Engine**:
   - Detailed reviews with 1–5 star rating, title, pros, and cons.
   - MongoDB aggregation pipeline that automatically recalculates college average ratings and review counts upon submission or deletion.

6. **JWT Authentication & Role-Based Access**:
   - Secure password hashing with `bcryptjs`.
   - Token-based authentication with expiration and protected routes.
   - Persistent favorites management and saved comparisons.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js 5.x, Mongoose 9.x, MongoDB
- **Security**: JWT (jsonwebtoken), bcryptjs, Helmet, CORS
- **Logging**: Morgan HTTP logger
- **Frontend**: React 19, React Router 7, Axios, Bootstrap 5.3
- **Data & Seeding**: Automated MongoDB seeder script with 12+ real-world premier institutes (IITs, NITs, BITS, DTU, IIIT-H, etc.)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`

### 2. Database Seeding
Populate the database with premier institutes, demo accounts, sample reviews, and Q&A threads:
```bash
npm run seed
# or
cd backend && node seeder.js
```

### 3. Running the Backend
```bash
npm run backend
# Backend server starts on http://localhost:5000
```

### 4. Running the Frontend
```bash
npm run frontend
# React frontend starts on http://localhost:3000
```

---

## 🔑 Demo Accounts for Instant Testing

| Role | Email | Password |
| :--- | :--- | :--- |
| **Demo Student** | `student@collegefinder.com` | `student123` |
| **Demo Admin** | `admin@collegefinder.com` | `admin123` |

*(One-click demo buttons are also provided directly on the Login page!)*

---

## 📚 RESTful API Specification

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student or admin
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve logged-in user profile with populated favorites (Protected)
- `PUT /api/auth/profile` — Update user profile information (Protected)

### Colleges (`/api/colleges`)
- `GET /api/colleges` — Search, filter by fees/state, sort, and paginate
- `GET /api/colleges/:id` — Get single college details, reviews, and related institutions
- `POST /api/colleges/predict` — Smart admission probability predictor
- `GET /api/colleges/stats/summary` — Aggregate platform statistics
- `POST /api/colleges` — Admin: Add college (Protected, Admin only)
- `PUT /api/colleges/:id` — Admin: Update college (Protected, Admin only)
- `DELETE /api/colleges/:id` — Admin: Delete college (Protected, Admin only)

### Reviews (`/api/reviews`)
- `GET /api/reviews/:collegeId` — Get all reviews for a college
- `POST /api/reviews` — Post or update student review (Protected)
- `DELETE /api/reviews/:id` — Delete review (Protected)

### Discussion Forum (`/api/questions`)
- `GET /api/questions` — List questions filtered by tag or search
- `GET /api/questions/:id` — View single question with answers
- `POST /api/questions` — Ask a question (Protected)
- `POST /api/questions/answer/:id` — Answer a question (Protected)
- `POST /api/questions/:id/upvote` — Upvote or remove upvote (Protected)

### User Data (`/api/users`)
- `POST /api/users/favorites/toggle` — Toggle favorite bookmark (Protected)
- `GET /api/users/favorites` — Retrieve populated favorite colleges (Protected)
- `POST /api/users/comparisons` — Save college comparison set (Protected)
- `GET /api/users/comparisons` — Retrieve saved comparison history (Protected)
