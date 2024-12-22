import "dotenv/config";
import Fastify from "fastify";
import mongoose from "mongoose";
import { PORT } from "./src/config/config.js";
import { buildAdminRouter, admin } from "./src/config/setup.js";
import "dotenv/config";
import { registerRoutes } from "./src/routes/index.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connection successful!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

const start = async () => {
    await connectDB();

    const app = Fastify();

    await registerRoutes(app);


    await buildAdminRouter(app);

    app.get("/", async (request, reply) => {
        reply.send({ message: "Welcome to Wear60 API" });
    });

    app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Wear60 listening at ${addr} and started on http://localhost:${PORT}${admin.options.rootPath}`);
        }
    });
};

start();
