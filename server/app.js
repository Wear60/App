import "dotenv/config";
import Fastify from "fastify";
import mongoose from "mongoose";
import { PORT } from "./src/config/config.js";
import { buildAdminRouter, admin } from "./src/config/setup.js";
import "dotenv/config";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

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

    app.register(fastifySocketIO,{
        cors: {
            origin: "*",
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ["websocket"],
    });

    await registerRoutes(app);


    await buildAdminRouter(app);

    app.get("/", async (request, reply) => {
        reply.send({ message: "Welcome to Wear60 API" });
    });

    app.listen({ port: PORT }, (err, addr) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Wear60 listening at ${addr} and started on http://localhost:${PORT}${admin.options.rootPath}`);
        }
    });

    app.ready().then(() => {
        app.io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("joinRoom", (orderId) => {
                socket.join(orderId);
                console.log(`User joined room ${orderId}`);
            });
            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });
    });
};

start();
