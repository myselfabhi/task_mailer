# Task Mailer - React/Next.js Version

A daily task entry and email reporting system built with Next.js and React. Team members can enter their daily tasks, and all tasks are shared across all users via a backend API.

## Features

- **Task Entry Form**: Add tasks with Task name, Start Date, End Date, Resource, Status, and Remarks
- **Shared Task List**: All team members see the same tasks (stored in backend)
- **Email Reporting**: Send formatted email reports with all tasks using EmailJS
- **Real-time Updates**: Tasks are fetched from the backend API
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **EmailJS** - Frontend email sending
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Click "Deploy"

That's it! Your app will be deployed automatically.

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Project Structure

```
task_mailer/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       └── route.ts      # Backend API endpoint
│   ├── components/
│   │   ├── TaskForm.tsx      # Task entry form
│   │   ├── TaskList.tsx      # Task list display
│   │   └── EmailConfig.tsx   # Email configuration
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── package.json
├── next.config.js
└── tsconfig.json
```

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Add a new task
- `DELETE /api/tasks?id={id}` - Delete a task
- `PUT /api/tasks` - Clear all tasks (body: `{ action: 'clear' }`)

## Email Configuration

The email configuration is pre-filled:
- **Recipient**: suneel.rajpoot@npstx.com
- **Sender Email**: abhinav.verma@npstx.com
- **Sender Name**: abhinav
- **Service ID**: service_dmu7wsp
- **Template ID**: template_jkplftf
- **Public Key**: v0sBqDfGCut4AVokn

## Important Notes

### Current Backend Storage

The backend uses **in-memory storage**, which means:
- ✅ Works for testing and small teams
- ⚠️ Data is lost when the serverless function restarts
- ⚠️ Not suitable for production with many users

### Upgrading to a Database (Recommended)

For production, upgrade to a persistent database:

1. **MongoDB Atlas** (Free tier available)
2. **Vercel Postgres** (Built-in Vercel integration)
3. **Vercel KV** (Redis-based)

Update `app/api/tasks/route.ts` to use your chosen database.

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

This project is open source and available for use.
