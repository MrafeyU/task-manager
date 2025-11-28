import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
try{
    const mongoURI = process.env.MONGO_URI as string;
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected Successfully");
}
catch(err){
    // Print full error for debugging
    console.error("❌ MongoDB connection failed with error:", err instanceof Error ? err.stack || err.message : err);
    // Don't exit the process immediately to allow diagnostics; rethrow so caller can decide
    throw err;
}
};

export default connectDB;
