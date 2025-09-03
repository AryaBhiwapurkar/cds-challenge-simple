# CDS Challenge - Tasks App (Simple)

This repository contains a simple MERN-style project (backend + frontend) demonstrating:
- Firebase Authentication (client) for registration/login
- Firebase Admin (backend) for ID token verification & custom claims (roles)
- Four CRUD APIs for Tasks with role-based access control
- Simple React frontend using Vite

## Structure
- backend/: Node/Express backend that verifies Firebase ID tokens and exposes /tasks APIs
- frontend/: React + Vite app that authenticates users and calls backend APIs
- .env.example files are included in each part

## Quick steps (local)
1. Start MongoDB locally (or use a hosted Mongo URI).
2. Backend:
   - `cd backend`
   - copy `.env.example` to `.env` and set values
   - place your Firebase service account JSON at the path you configured
   - `npm install`
   - `npm run dev`
3. Frontend:
   - `cd frontend`
   - copy `.env.example` to `.env.local` and set values
   - `npm install`
   - `npm run start`

## Notes
- Use `node setRole.js <uid> admin` to set a user as admin (run from backend folder with service account available).
- Do NOT commit your Firebase service account JSON or any private keys to GitHub.
