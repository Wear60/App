import "dotenv/config";
import fastifySession from "fastify-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import bcrypt from "bcrypt";
import { Admin } from "../models/index.js"; // Import Admin model
import Joi from "joi";

// Validate environment variables
const envSchema = Joi.object({
    MONGODB_URI: Joi.string().required(),
    COOKIE_PASSWORD: Joi.string().required(),
    PORT: Joi.number().default(3000),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);
if (error) {
    console.error("Environment variable validation error:", error.message);
    process.exit(1);
}

export const { MONGODB_URI, COOKIE_PASSWORD, PORT } = env;

// Initialize MongoDBStore for session management
const MongoDBStore = ConnectMongoDBSession(fastifySession);
export const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    secret: COOKIE_PASSWORD,  // To secure the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Use 'secure' cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
});

// Handle session store errors
sessionStore.on("error", (error) => {
    console.error("Session store error:", error);
});

// Secure authentication function
export const authenticate = async (email, password) => {
    const user = await Admin.findOne({ email }); // Query Admin model by email
    if (!user) return null; // Return null if user doesn't exist

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare provided password with the stored hashed password
    return isPasswordValid ? user : null; // Return user if password is valid, otherwise return null
};
