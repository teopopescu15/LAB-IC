import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Check if the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in your environment variables');
}

async function dbConnect() {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState >= 1) {
    console.log('Using existing MongoDB connection');
    return;
  }
  
  try {
    // Connection options to avoid deprecation warnings
    const options = {
      // These options are no longer needed in mongoose 6+
      // but keeping for clarity
    };
    
    console.log('Connecting to MongoDB...');
    // The non-null assertion (!) tells TypeScript that MONGODB_URI is definitely not null
    // We've already checked above that it's not undefined
    await mongoose.connect(MONGODB_URI!);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check your MongoDB connection string and network');
    throw error; // Rethrow to handle it in the calling function
  }
}

export default dbConnect;