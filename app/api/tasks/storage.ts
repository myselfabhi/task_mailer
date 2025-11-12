// MongoDB storage implementation
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'task_mailer';
const COLLECTION_NAME = 'tasks';

export interface Task {
  id: string;
  task: string;
  startDate: string;
  endDate: string;
  resource: string;
  status: string;
  remarks: string;
  createdAt?: string;
}

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection<Task>(COLLECTION_NAME);
}

export async function getTasks(): Promise<Task[]> {
  try {
    const collection = await getCollection();
    const tasks = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return tasks.map(task => ({
      ...task,
      id: task.id || (task as any)._id?.toString() || ''
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function addTask(task: Task): Promise<Task> {
  try {
    const collection = await getCollection();
    const result = await collection.insertOne(task);
    return { ...task, id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    const collection = await getCollection();
    let query: any = { id };
    
    // Also try _id if it's a valid ObjectId
    try {
      const objectId = new ObjectId(id);
      query = { $or: [{ id }, { _id: objectId }] };
    } catch {
      // If id is not a valid ObjectId, just use id field
      query = { id };
    }
    
    const result = await collection.deleteOne(query);
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

export async function clearTasks(): Promise<void> {
  try {
    const collection = await getCollection();
    await collection.deleteMany({});
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
}

