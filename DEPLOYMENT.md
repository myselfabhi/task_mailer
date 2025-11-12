# Deployment Guide for Vercel

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)

## Deployment Steps

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Task Mailer with backend API"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/task_mailer.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the project settings
5. Click "Deploy"

### 3. Configure Vercel (if needed)

The project should work out of the box. However, if you encounter issues:

- **Framework Preset**: Other
- **Build Command**: Leave empty (no build step)
- **Output Directory**: Leave empty
- **Install Command**: `npm install` (if needed)

### 4. Access Your Deployed App

After deployment, Vercel will provide you with a URL like:
`https://your-project-name.vercel.app`

## Important Notes

### Current Backend Storage

The current backend uses **in-memory storage**, which means:
- ✅ Works for testing and small teams
- ⚠️ Data is lost when the serverless function restarts
- ⚠️ Not suitable for production with many users

### Upgrading to a Database (Recommended)

For production use, you should upgrade to a persistent database:

#### Option 1: MongoDB Atlas (Free Tier)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `api/tasks.js` to use MongoDB

#### Option 2: Vercel Postgres

1. In Vercel dashboard, go to Storage
2. Create a Postgres database
3. Update `api/tasks.js` to use Postgres

#### Option 3: Vercel KV (Redis)

1. In Vercel dashboard, go to Storage
2. Create a KV database
3. Update `api/tasks.js` to use KV

## Testing After Deployment

1. Open your deployed URL
2. Add a task
3. Open the same URL in another browser/device
4. You should see the same tasks (shared backend!)

## Troubleshooting

### API Not Working

- Check Vercel function logs in the dashboard
- Ensure the API route is at `/api/tasks`
- Check browser console for errors

### CORS Issues

- The API includes CORS headers
- If issues persist, check Vercel function logs

## Next Steps

1. Deploy to Vercel
2. Test with multiple users
3. Upgrade to a database for persistence
4. Add authentication if needed (optional)

