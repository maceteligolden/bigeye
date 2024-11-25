import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "yourAccessTokenSecret";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function middleware(req: Request) {
  const accessToken = cookies().get("accessToken")?.value;
  const refreshToken = cookies().get("refreshToken")?.value;

  // if(!refreshToken && !accessToken) {
  //   return NextResponse.redirect(new URL("/auth/login", req.url));
  // }

  if(accessToken && (req.url === BASE_URL || req.url === `${BASE_URL}auth/login`)){
    return NextResponse.redirect(new URL("/app", req.url))
  }

  // Validate the access token
  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
      await jwtVerify(accessToken!, secret); 
      if(req.url === "http://localhost:3000/auth/login"){
        NextResponse.redirect(new URL("/app", req.url))
      }
      return NextResponse.next();
    } catch (error) {
      console.log("Access token expired or invalid. Attempting to refresh...");
    }
  }

  // If no access token or it's invalid, attempt to refresh using refresh token
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(`http://localhost:3000/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        console.error("Failed to refresh token.");
        return NextResponse.redirect(new URL(`/auth/login`, req.url)); // Redirect to login
      }

      const { accessToken: newAccessToken } = await refreshResponse.json();

      // Attach new access token to headers for the next request
      const response = NextResponse.next();
      response.headers.set("authorization", `Bearer ${newAccessToken}`);
      return response;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return NextResponse.redirect(new URL("/auth/login", req.url)); // Redirect to login
    }
  }

  // If no valid tokens, redirect to login
  return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  runtime: "nodejs",
  matcher: ["/", "/app"], // Define protected routes here
};
