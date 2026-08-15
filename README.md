# GoalForge

Forge goals. Make progress real.

GoalForge is a focused goal tracker for setting goals, tracking milestones, and keeping yourself honest.

## Features

- Account auth: register, login, password reset, change password
- Goals: create and edit goals with milestones and progress tracking
- Reminders & alarms with web push notifications (including iOS via `install-goalforge.mobileconfig`)
- Share goals with others
- Analytics and account settings
- Installable PWA with offline shell and home-screen icons

## Tech stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4, React Router 7, axios, ESLint 10
- **Backend:** Spring Boot 3.2.5 / Java 21 (Maven), JWT auth, endpoints under `/api/...`

## Repositories

- Frontend: https://github.com/LayiCode/GoalForge-Frontend
- Backend: https://github.com/LayiCode/GoalForge-Backend

## Getting started

Requires Node 22+.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and expects the backend on `http://localhost:8080`.

```bash
npm run build   # production build to dist/
npm run preview # preview the production build
npm run lint    # run ESLint
npm run gen:icons # regenerate PWA icons
```

## API URL config

The backend URL is baked into the bundle at build time via the `VITE_API_URL` environment variable. There is no runtime `config.js`.

- Default (unset): `http://localhost:8080`
- Vercel build env: `https://goalforge-punl.onrender.com`
- Docker build arg: `VITE_API_URL` (see `Dockerfile`)

## Backend

Spring Boot REST API, deployed on Render at `https://goalforge-punl.onrender.com`.

- Auth: JWT bearer tokens (`/api/auth/...`)
- Resources: goals, milestones, reminders, sharing, analytics, push subscriptions (`/api/...`)

## Deployment

- **Frontend (live):** [goal-forge-frontend.vercel.app](https://goal-forge-frontend.vercel.app) — Vercel, auto-deploys on push to `main`. `VITE_API_URL` is set as a build-time env var.
- **Backend (live):** `https://goalforge-punl.onrender.com` — Render.
- **Frontend (optional Docker):** `Dockerfile` + `nginx.conf` + `render.yaml` for a Render Blueprint deploy; pass `VITE_API_URL` as a build arg.
