import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userSession = cookieStore.get("user-session");
    
    if (userSession) {
      try {
        const user = JSON.parse(userSession.value);
        return NextResponse.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      } catch (error) {
        console.error("Error parsing user session:", error);
        return NextResponse.json({ user: null });
      }
    }
    
    return NextResponse.json({ user: null });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  }
} 