# 9TD — Task Dashboard (Desktop App)

A forward-looking, bright-but-grown-up task dashboard with 2D/3D motion, built as an Electron + React + TypeScript desktop app.
Back-end scaffold provided in PHP (for shared hosting like Namecheap). Data you create will live in your own API/database.

## What you get
- Electron desktop wrapper
- Vite + React + TypeScript + TailwindCSS + Zustand + Framer Motion
- Optional 3D header logo using `@react-three/fiber` + `three`
- Shadcn/Radix UI primitives wired for toasts, dialogs, dropdowns
- Client-side user activity logs (per-user visibility)
- Feature tabs: Dashboard, Create Tasks, Your Tasks, Logs, Signout
- Search bar centered in the header, animated 3D "9TD" logo on the left, avatar on the right
- Create Task modal with advanced fields (tags, sub-tags, categories, due date, priority, assignees, attachments)
- Colorful tag system w/ categories & sub-tags
- Admin Panel stub (visible only to site admin role)
- Direct Messages (DM) UI scaffold (requires API to persist)
- PHP API scaffold for auth/tasks/messages/logs compatible with typical shared hosting

## Quickstart (Desktop)
```bash
# 1) Install Node 18+ and pnpm or npm
# With npm
cd apps/desktop
npm install
npm run dev    # run in a development browser
npm run electron:dev  # run as a desktop app with hot reload

# 2) Build desktop app
npm run build
npm run electron:build
```

## Quickstart (PHP API scaffold on shared hosting)
- Upload `server/php-api` to your hosting.
- Copy `.env.example` to `.env` and set DB credentials.
- Import `server/php-api/src/schema.sql` into your MySQL.
- Point your subdomain to `server/php-api/public`.
- Endpoints documented in `server/php-api/README.md`.

## Notes
- This is a scaffold: you will populate real data. 
- The client expects an API base url in `VITE_API_BASE_URL` env var.
