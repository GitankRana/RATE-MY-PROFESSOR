# 🎓 Rate My Professor

A full-stack web application that empowers students to discover, rate, and review their professors. Built with a sleek dark UI inspired by Spotify, real-time data, and a focus on honest, student-driven feedback.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma |
| Auth | JWT |

---

## ✨ Features

- 🔐 Secure register, login, and logout with JWT authentication
- 🏫 Browse professors with search, department & university filters, and rating sort
- ⭐ Interactive star rating system
- 💬 Submit, edit, and delete your own reviews
- 🏷️ Tag professors with labels like "Tough Grader" or "Very Helpful"
- 👍 Like and dislike reviews with toggle support
- 🎨 Color-coded rating badges — green, yellow, and red
- 👤 Personal profile page with your review history and stats
- ➕ Any logged-in user can add a professor
- 🌑 Spotify-inspired dark theme with red accents


## 🧠 What I Learned

- How to architect a full-stack application from scratch — structuring a REST API with Express, connecting it to a PostgreSQL database via Prisma, and consuming it from a React frontend
- Implementing JWT-based authentication end-to-end, from hashing passwords and signing tokens on the server to protecting routes and decoding payloads on the client
- Designing relational database schemas with real-world relationships — users, professors, reviews, and likes — and writing efficient Prisma queries with nested includes
- Debugging CORS issues, proxy misconfigurations, and environment-specific errors across a monorepo setup
- Building reusable React components and managing UI state across multiple pages without a global state library
- How small UX details — loading skeletons, color-coded badges, hover states, and toast feedback — dramatically improve the feel of an app
