import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "yourAccessTokenSecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "yourRefreshTokenSecret";

export async function middleware(req: Request) {
    if (url.startsWith(`${process.env.NEXT_PUBLIC_BASE_URL}/app`)) {
  const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");
  const refreshToken = cookies().get("refreshToken")?.value;
  console.error("Error refreshing token:", refreshToken);
  // Validate the access token
  if (accessToken) {
    try {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.log("Access token expired or invalid. Attempting to refresh...");
    }
  }

  // If no access token or it's invalid, attempt to refresh using refresh token
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        console.error("Failed to refresh token.");
        return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
      }

      const { accessToken: newAccessToken } = await refreshResponse.json();

      // Attach new access token to headers for the next request
      const response = NextResponse.next();
      response.headers.set("authorization", `Bearer ${newAccessToken}`);
      return response;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
    }
  }

  // If no valid tokens, redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
  matcher: ["/app/:path*"], // Define protected routes here
};
