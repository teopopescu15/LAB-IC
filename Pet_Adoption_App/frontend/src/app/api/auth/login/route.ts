import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("Login API route called");
  
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Connected to database successfully");
    
    const { email, password } = await request.json();
    console.log("Login attempt for email:", email);
    
    // Find user by email
    console.log("Searching for user in database...");
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found with email:", email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    console.log("User found, verifying password...");
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      console.log("Password verification failed");
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log("Login successful for user:", user.email);
    
    // Create user session data
    const userSession = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    // Create response with user info
    const response = NextResponse.json({
      message: 'Login successful',
      user: userSession
    });
    
    // Set session cookie (expires in 7 days)
    response.cookies.set("user-session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}