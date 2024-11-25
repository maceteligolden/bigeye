import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "yourRefreshTokenSecret";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "yourAccessTokenSecret";
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes

export async function POST(req: Request) {
  try {
     // Access cookies using the cookies() function
     const cookieStore = cookies();
     const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token not provided" }, { status: 401 });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }
}
