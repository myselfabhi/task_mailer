# Task Mailer

Daily task entry and email reporting system built with Next.js, React, and MongoDB.

## Features

- ✅ Add, view, and delete daily tasks
- ✅ Persistent storage with MongoDB
- ✅ Email reports via Nodemailer (SMTP)
- ✅ Automatic task clearing at midnight (via cron job)
- ✅ Team collaboration - shared task list

## Prerequisites

- Node.js >= 18.17.0
- MongoDB Atlas account (free tier works)
- SMTP email account (Gmail, SendGrid, AWS SES, etc.)


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
- `POST /api/email` - Send email report

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SMTP_HOST` | SMTP server host (default: smtp.gmail.com) | No |
| `SMTP_PORT` | SMTP server port (default: 587) | No |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASSWORD` | SMTP password/app password | Yes |
| `SMTP_SECURE` | Use SSL/TLS (true for 465, false for 587) | No |
| `CRON_SECRET` | Secret key for cron job auth | No |


