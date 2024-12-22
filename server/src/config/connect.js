import mongoose from "mongoose";


export const connectDB = async (URI) => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error", error);
    }
}