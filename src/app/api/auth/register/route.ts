import { dbConnect } from '@/facades/mongoose.facade';
import { NextResponse } from 'next/server';

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

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Internal Server error" }, { status: 500 });
  }
}
