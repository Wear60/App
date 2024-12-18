import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js"; // Import models
import { sessionStore } from "./config.js"; // Import session store

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Branch,
            options: {
                listProperties: ["name", "location", "createdAt"],
                filterProperties: ["name", "location"],
                editProperties: ["name", "location"],
                showProperties: ["_id", "name", "location", "createdAt"],
            },
        },
    ],
    branding: {
        companyName: "Wear60",
        logo: "/path/to/logo.png",
        softwareBrothers: false,
    },
    rootPath: process.env.ADMIN_ROOT_PATH || "/admin",
});

export const buildAdminRouter = async (app) => {
    try {
        await AdminJSFastify.buildAuthenticatedRouter(
            admin,
            {
                authenticate: async (email, password) => {
                    const user = await authenticate(email, password);
                    if (user) {
                        return { email: user.email, role: user.role };
                    }
                    return null;
                },
                cookieName: "adminjs",
                cookiePassword: process.env.COOKIE_PASSWORD,
            },
            app,
            { store: sessionStore }
        );
        console.log("AdminJS router built successfully");
    } catch (error) {
        console.error("Error setting up AdminJS router:", error);
        throw error;
    }
};
