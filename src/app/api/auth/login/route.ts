import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/facades/mongoose.facade";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    // console.log("email" + email)
    // // Connect to the database
    const client = await dbConnect();
    const db = client.db('bigeye');
    const collection = db.collection('users');

    // // Validate input
    if (!email || !password) {
       return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // // Find the user
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // // Check password

    if (password !== user.password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // // Generate tokens
    const accessToken = jwt.sign({ userId: user._id, email: user.email }, "yourAccessTokenSecret", {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, "yourRefreshTokenSecret", {
      expiresIn: "7d",
    });

    // // Send refresh token as HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful", accessToken});
    response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true });
    response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
