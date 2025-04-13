import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request:Request){
    console.log("Signup API route called");
    
    try {
        console.log("Connecting to database...");
        await dbConnect();
        console.log("Connected to database successfully");
        
        const {name, email, password} = await request.json();
        console.log("Received signup request for:", email);
        
        // Check if user already exists
        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({email});
        
        if(existingUser){
            console.log("User already exists with email:", email);
            return NextResponse.json(
                {ERROR: 'User already exists'},
                {status: 400}
            );
        }
        
        // Hash password and create user
        console.log("Creating new user...");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPassword});
        
        // Save user to database
        console.log("Saving user to database...");
        await newUser.save();
        console.log("User saved successfully with ID:", newUser._id);
        
        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            },
            {status: 201}
        );
    } catch(error: any) {
        console.error("Signup error:", error);
        
        // Provide more specific error messages
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                {error: 'Validation error: ' + error.message},
                {status: 400}
            );
        }
        
        return NextResponse.json(
            {error: 'Internal server error: ' + error.message},
            {status: 500}
        );
    }
}