# Deployment Guide — Task Manager

This document describes how to deploy the app with a production-ready setup:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- (Optional) File uploads: AWS S3

Quick checklist

- [ ] Create MongoDB Atlas cluster and DB user
- [ ] Deploy backend to Render with env vars
- [ ] Deploy frontend to Vercel and point VITE_API_URL at backend
- [ ] Configure CORS and Socket.IO origins
- [ ] Setup S3 for file uploads (recommended)
- [ ] Smoke test and enable automatic deploys

Important environment variables

Backend (Render service):

- MONGO_URI: mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
- JWT_SECRET: a secure random string
- NODE_ENV: production
- FRONTEND_ORIGIN: https://<your-frontend-domain> (used for CORS)
- SOCKET_IO_ORIGIN: optional, same as FRONTEND_ORIGIN
- (Optional S3) AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET

Frontend (Vercel project):

- VITE_API_URL: https://<your-backend-url-on-render>

MongoDB Atlas setup (short)

1. Sign in to https://cloud.mongodb.com and create a free or paid project.
2. Create a Cluster (the free tier is usually fine for demos).
3. In "Database Access", create a database user and password with a suitable role (read/write)
4. In "Network Access", add IP access list entries for:
   - Your development machine (or `0.0.0.0/0` for testing; NOT recommended for production)
   - Render's outbound IPs if you use a private network or need fixed whitelisting
5. Get the connection string and replace `<password>` and `<dbname>`.
6. Set `MONGO_URI` in Render's environment variables.

Backend: Render deployment steps

1. Sign in to https://render.com and create a new **Web Service**.
2. Connect your GitHub repo and choose the repo root (or `backend` sub-dir if using monorepo). If the repo has multiple projects, use `rootDir` settings.
3. Build & start commands:
   - Build Command: `npm run build`
   - Start Command: `npm start` (this runs `node dist/server.js` per package.json)
4. Set Environment:
   - `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_ORIGIN=https://<yourfrontdomain>`
   - Add optional S3 env vars if you plan to use S3
5. Health check path: `/` (the server responds with a simple string)
6. Enable Auto Deploy from your main branch.
7. Make sure uploads are stored on S3 — Render ephemeral storage will not persist across deploys/restarts.

Notes: file uploads in production

- Do not rely on local disk for uploads on Render (ephemeral). Use S3 or another object store.
- If you want S3-based uploads, switch multer storage to `multer-s3` and use the `AWS_*` env vars above.

Frontend: Vercel deployment steps

1. Sign in to https://vercel.com and create a new project.
2. Import the repo and set the Project Root to `/frontend` (if monorepo).
3. Build & Output:
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` → `https://<your-render-backend-url>`
5. Enable automatic deploys from `main`.

CORS & Socket.IO configuration

- Use `FRONTEND_ORIGIN` to limit CORS:
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '\*' }));
- Configure Socket.IO with CORS origin: `origin: process.env.SOCKET_IO_ORIGIN || '*'`

DNS & custom domains

- Vercel: add your custom domain in the Vercel project, follow the DNS steps.
- Render: add custom domain and configure DNS to point to the Render service.

Testing & smoke tests

- After deployment:
  1. Open frontend URL and verify the app loads
  2. Register a new account and login
  3. Create tasks, upload attachments and verify they appear and are accessible
  4. Test real-time notifications (if available) at least once

Monitoring & logging

- Enable Render logs for the backend. Check stdout/stderr for any runtime errors.
- Consider adding a basic uptime monitor (e.g., UptimeRobot) to the backend health check.

Rollbacks & maintenance

- Render & Vercel both provide an easy rollback by using a previous deployment in the dashboard.
- Keep `JWT_SECRET` and DB credentials rotated periodically and stored in the provider secrets.

Security notes

- Use strong `JWT_SECRET` (32+ chars random)
- Lock down `FRONTEND_ORIGIN` to your exact domain in production
- Use HTTPS for all sites
- Use S3 with least privilege IAM keys and limit CORS on the bucket

Local testing of production build

1. Ensure `VITE_API_URL` points to the running backend (e.g., `export VITE_API_URL=http://localhost:8000`)
2. Build frontend: `cd frontend && npm run build`
3. Serve `dist` using a static server (e.g., `npm i -g serve && serve -s dist`)

If you want, I can:

- Provision a MongoDB Atlas cluster and add `MONGO_URI` to Render.
- Create Render & Vercel projects and add environment variables for you (I will need access or the credentials to your accounts).

---

If you want, I can now provision MongoDB Atlas and move to deploying the backend on Render. Say the word and I’ll start the next task.
