# Task Mailer

Daily task entry and email reporting system built with Next.js, React, and MongoDB.

## Features

- ✅ Add, view, and delete daily tasks
- ✅ Persistent storage with MongoDB
- ✅ Email reports via EmailJS
- ✅ Automatic task clearing at midnight (via cron job)
- ✅ Team collaboration - shared task list

## Prerequisites

- Node.js >= 18.17.0
- MongoDB Atlas account (free tier works)
- EmailJS account (for email sending)

## Setup Instructions

### 1. MongoDB Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Create" → Choose "Free" tier
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access" → "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add Render's IP ranges or use 0.0.0.0/0
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<username>` with your database username
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### 2. Local Development Setup

1. **Clone and Install:**
   ```bash
   git clone <your-repo-url>
   cd task_mailer
   npm install
   ```

2. **Create Environment File:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   CRON_SECRET=your_secret_key_here_optional
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 3. Deploy to Render

#### Option A: Deploy from GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add MongoDB persistence"
   git push origin main
   ```

2. **Create Render Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `task_mailer` repository

3. **Configure Render Service:**
   - **Name:** `task-mailer` (or your preferred name)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** `18` or `20`

4. **Add Environment Variables:**
   - Click "Environment" tab
   - Add the following:
     - `MONGODB_URI` = `your_mongodb_connection_string`
     - `CRON_SECRET` = `your_secret_key` (optional, for cron job security)
     - `NODE_ENV` = `production`

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - Wait for deployment to complete (usually 2-5 minutes)

#### Option B: Deploy via Render CLI

1. **Install Render CLI:**
   ```bash
   npm install -g render-cli
   ```

2. **Login:**
   ```bash
   render login
   ```

3. **Create Service:**
   ```bash
   render create web-service
   ```

### 4. Setup Cron Job for Midnight Task Clearing

Render doesn't have built-in cron jobs, but you can use:

#### Option A: External Cron Service (Recommended)

Use a service like [cron-job.org](https://cron-job.org/) or [EasyCron](https://www.easycron.com/):

1. **Sign up** for a free cron service
2. **Create a new cron job:**
   - **URL:** `https://your-app.onrender.com/api/tasks/clear`
   - **Schedule:** `0 0 * * *` (runs at midnight UTC)
   - **Method:** `GET`
   - **Headers:** (if you set CRON_SECRET)
     - `Authorization: Bearer your_secret_key`

#### Option B: Render Cron Jobs (Paid Feature)

If you have a paid Render plan:
1. Go to your Render dashboard
2. Create a "Cron Job" service
3. Set schedule: `0 0 * * *`
4. Command: `curl https://your-app.onrender.com/api/tasks/clear`

### 5. Verify Deployment

1. **Check MongoDB Connection:**
   - Add a task in your deployed app
   - Check MongoDB Atlas → Collections → `task_mailer` → `tasks`
   - You should see your task document

2. **Test API Endpoints:**
   - `GET https://your-app.onrender.com/api/tasks` - Should return tasks
   - `POST https://your-app.onrender.com/api/tasks` - Should create a task
   - `DELETE https://your-app.onrender.com/api/tasks?id=task_id` - Should delete a task

## Project Structure

```
task_mailer/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # Main API routes (GET, POST, DELETE, PUT)
│   │       ├── storage.ts        # MongoDB operations
│   │       └── clear/
│   │           └── route.ts      # Cron job endpoint
│   ├── components/
│   │   ├── TaskForm.tsx          # Add task form
│   │   ├── TaskList.tsx          # Task list display
│   │   └── EmailConfig.tsx       # Email sending modal
│   └── page.tsx                  # Main page
├── lib/
│   └── mongodb.ts                # MongoDB connection utility
└── .env.local                    # Environment variables (not in git)
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `DELETE /api/tasks?id={id}` - Delete a task
- `PUT /api/tasks` - Clear all tasks (body: `{ action: 'clear' }`)
- `GET /api/tasks/clear` - Clear all tasks (for cron jobs)

## Troubleshooting

### MongoDB Connection Issues

- **Error: "MONGODB_URI is not configured"**
  - Check that `.env.local` exists and has `MONGODB_URI`
  - On Render, verify environment variables are set

- **Error: "Authentication failed"**
  - Verify username/password in connection string
  - Check database user has correct permissions

- **Error: "IP not whitelisted"**
  - Add your IP or `0.0.0.0/0` to MongoDB Atlas Network Access

### Render Deployment Issues

- **Build fails:**
  - Check Node.js version matches `engines` in `package.json`
  - Verify all dependencies are in `package.json`

- **App crashes:**
  - Check Render logs: Dashboard → Your Service → Logs
  - Verify `MONGODB_URI` is set correctly
  - Check MongoDB connection string format

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CRON_SECRET` | Secret key for cron job auth | No |
| `NODE_ENV` | Environment (development/production) | Auto-set by Render |

## License

MIT
