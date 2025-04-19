import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

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
    
    // Return user info (exclude password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}