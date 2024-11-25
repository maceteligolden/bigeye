import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/facades/mongoose.facade";
import { User } from "@/models";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "yourAccessTokenSecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "yourRefreshTokenSecret";
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

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
    console.log("user: " + user);
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
  } catch (error: any) {
    console.error('Error in registration route:', error);
    return NextResponse.json({ message: error.toString() }, { status: 500 });
  }
}
