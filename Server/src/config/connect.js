import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("DB CONNECTED");
    } catch (err) {
        console.error("Database connection error: ", err);
    }
};
