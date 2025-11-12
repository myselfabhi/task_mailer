# How to Run the Application

## Quick Start

The backend API is integrated into Next.js, so you only need to run one command:

```bash
npm install
npm run dev
```

This starts both the frontend and backend together!

## Detailed Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

This will:
- Start the Next.js development server
- Start the backend API at `/api/tasks`
- Open the frontend at `http://localhost:3000`

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api/tasks

## Backend API Endpoints

All endpoints are available at `http://localhost:3000/api/tasks`:

- **GET** `/api/tasks` - Fetch all tasks
- **POST** `/api/tasks` - Add a new task
- **DELETE** `/api/tasks?id={taskId}` - Delete a task
- **PUT** `/api/tasks` - Clear all tasks (body: `{ action: 'clear' }`)

## Testing the Backend

You can test the API directly using curl or any API client:

### Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

### Add a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task": "OC183",
    "startDate": "2025-11-12",
    "endDate": "2025-11-12",
    "resource": "Abhinav",
    "status": "Completed",
    "remarks": "Test task"
  }'
```

### Delete a task:
```bash
curl -X DELETE "http://localhost:3000/api/tasks?id=TASK_ID_HERE"
```

## Production Build

For production:

```bash
npm run build
npm start
```

This builds the app and starts the production server.

## Important Notes

- **No separate backend server needed** - Next.js handles both frontend and backend
- The API routes are in `app/api/tasks/route.ts`
- Backend runs automatically when you run `npm run dev`
- All team members will see the same tasks (shared backend)

## Troubleshooting

### Port already in use?
Change the port:
```bash
PORT=3001 npm run dev
```

### Dependencies not installing?
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API not working?
- Make sure the dev server is running
- Check browser console for errors
- Verify the API route file exists at `app/api/tasks/route.ts`

