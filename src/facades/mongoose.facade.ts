import { MongoClient } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGODB_URI || '';
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

export async function dbConnect() {
  return new MongoClient(uri);
}
