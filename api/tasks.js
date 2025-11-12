// Simple in-memory storage (for demo - replace with database in production)
// In production, use MongoDB, PostgreSQL, or Vercel KV
let tasksStorage = [];

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  try {
    // GET - Fetch all tasks
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, tasks: tasksStorage });
    }

    // POST - Add a new task
    if (req.method === 'POST') {
      const { task, startDate, endDate, resource, status, remarks } = req.body;

      if (!task || !startDate || !endDate || !resource || !status) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
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
      return res.status(201).json({ success: true, task: newTask });
    }

    // DELETE - Delete a task
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Task ID is required'
        });
      }

      const initialLength = tasksStorage.length;
      tasksStorage = tasksStorage.filter(t => t.id !== id);

      if (tasksStorage.length < initialLength) {
        return res.status(200).json({ success: true, message: 'Task deleted' });
      } else {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
    }

    // PUT - Clear all tasks
    if (req.method === 'PUT' && req.body.action === 'clear') {
      tasksStorage = [];
      return res.status(200).json({ success: true, message: 'All tasks cleared' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

