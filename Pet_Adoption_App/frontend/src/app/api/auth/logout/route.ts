import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear the user session cookie
    cookieStore.delete("user-session");
    
    const response = NextResponse.json({
      message: "Logout successful"
    });
    
    // Also set the cookie to expire in the response headers
    response.cookies.set("user-session", "", {
      expires: new Date(0),
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
} 