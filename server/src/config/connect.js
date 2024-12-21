import mongoose from "mongoose";


export const connectDB = async (URL) => {
    try {
        await mongoose.connect(URL)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection error", error);
    }
}