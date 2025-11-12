import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI || '';

if (!uri) {
  console.warn('MONGODB_URI is not set. Please add it to .env.local');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Create a dummy promise that will reject if used without URI
  clientPromise = Promise.reject(new Error('MONGODB_URI is not configured'));
} else if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

