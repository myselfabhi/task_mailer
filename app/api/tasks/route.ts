// MongoDB storage
import { addTask, deleteTask, clearTasks, getTasks } from './storage';

export async function GET() {
  try {
    const tasks = await getTasks();
    return Response.json({ success: true, tasks });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Failed to fetch tasks', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task, startDate, endDate, resource, status, remarks } = body;

    if (!task || !startDate || !endDate || !resource || !status) {
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      task,
      startDate,
      endDate,
      resource,
      status,
      remarks: remarks || '',
      createdAt: new Date().toISOString()
    };

    const savedTask = await addTask(newTask);
    return Response.json({ success: true, task: savedTask }, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, message: 'Task ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteTask(id);

    if (deleted) {
      return Response.json({ success: true, message: 'Task deleted' });
    } else {
      return Response.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'clear') {
      await clearTasks();
      return Response.json({ success: true, message: 'All tasks cleared' });
    }

    return Response.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}


