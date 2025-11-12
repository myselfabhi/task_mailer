// Simple in-memory storage (for demo - replace with database in production)
// In production, use MongoDB, PostgreSQL, or Vercel KV
let tasksStorage: any[] = [];

export async function GET() {
  return Response.json({ success: true, tasks: tasksStorage });
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

    tasksStorage.push(newTask);
    return Response.json({ success: true, task: newTask }, { status: 201 });
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

    const initialLength = tasksStorage.length;
    tasksStorage = tasksStorage.filter((t: any) => t.id !== id);

    if (tasksStorage.length < initialLength) {
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
      tasksStorage = [];
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


