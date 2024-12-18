import "dotenv/config"; // Load environment variables
import Fastify from "fastify"; // Import Fastify
import { connectDB } from './src/config/connect.js'; // MongoDB connection setup
import { buildAdminRouter } from "./src/config/setup.js"; // AdminJS router setup
import fastifyHelmet from "@fastify/helmet"; // For added security

const start = async () => {
    try {
        // Destructure environment variables
        const { MONGO_URI, PORT = 3000 } = process.env;

        // Validate MONGO_URI
        if (!MONGO_URI) {
            console.error("Error: MONGO_URI is not defined in the environment variables.");
            process.exit(1);
        }

        console.log("MongoDB URI:", MONGO_URI);

        // Connect to MongoDB
        await connectDB(MONGO_URI);
        console.log("Connected to MongoDB");

        // Create Fastify instance
        const app = Fastify();

        // Register helmet for security
        await app.register(fastifyHelmet);

        // Build the AdminJS router
        const { admin } = await buildAdminRouter(app);
        console.log("AdminJS router built successfully");

        // Start the Fastify server
        app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
            if (err) {
                console.error("Error starting server:", err);
                process.exit(1);
            }
            console.log(`Wear60 Started on ${address}${admin.options.rootPath}`);
        });

        // Handle graceful shutdown
        const shutdown = async () => {
            console.log("Shutting down server...");
            await app.close();
            console.log("Server closed.");
            process.exit(0);
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

    } catch (error) {
        console.error("Error starting application:", error);
        process.exit(1);
    }
};

start();
