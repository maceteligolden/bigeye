import { dbConnect } from '@/facades/mongoose.facade';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // Parse incoming data
    const { firstname, lastname, email, password } = await req.json();

    // Basic validation
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Connect to the database
    const client = await dbConnect();
    const db = client.db('bigeye');
    const collection = db.collection('users');

    // Check if the user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Insert the user into the database
    const newUser = { firstname, lastname, email, password };
    await collection.insertOne(newUser);

    console.log('success'); // Log success message
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error in registration route:', error);
    return NextResponse.json({ message: error.toString() }, { status: 500 });
  }
}
