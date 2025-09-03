# Backend - CDS Challenge

## Setup
1. Copy `.env.example` to `.env` and fill values (MONGO_URI, FIREBASE_SERVICE_ACCOUNT path).
2. Place Firebase Service Account JSON at the path you set.
3. `npm install`
4. `npm run dev`

## Role assignment
Run:
```
node setRole.js <uid> admin
```
to set a user's role to admin. The user must sign out and sign in again to pick up custom claims.
