// API route to clear all tasks (called by cron job at midnight)
import { clearTasks } from '../storage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify it's a cron job request (optional - add auth header check if needed)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is set, verify it
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Clear tasks from MongoDB
    await clearTasks();
    
    return Response.json({ 
      success: true, 
      message: 'Tasks cleared at midnight',
      timestamp: new Date().toISOString(),
      timezone: 'UTC'
    });
  } catch (error: any) {
    console.error('Error clearing tasks:', error);
    return Response.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

