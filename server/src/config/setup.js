import AdminJS from "adminjs";
import * as AdminJsMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
import * as Models from "../models/index.js";
import { COOKIE_PASSWORD, sessionStore, authenticate } from "./config.js";
import {dark,light,noSidebar} from '@adminjs/themes';

AdminJS.registerAdapter(AdminJsMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                navigation: { name: "Wear60", icon: "User" }, // Change "Test" to "Wear60"
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                navigation: { name: "Wear60", icon: "User" }, // Group under "Wear60"
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Admin,
            options: {
                navigation: { name: "Wear60", icon: "User" }, // Group under "Wear60"
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Branch,
            options: {
                navigation: { name: "Wear60", icon: "Building" }, // Group under "Wear60"
            },
        },
        {resource: Models.Category,
            options: {
                navigation: { name: "Wear60", icon: "Building" }, // Group under "Wear60"
            },
        },
        {resource: Models.Product,
            options: {
                navigation: { name: "Wear60", icon: "Building" }, // Group under "Wear60"
            },
            
        },

        {resource: Models.Order,
            options: {
                navigation: { name: "Wear60", icon: "Building" }, // Group under "Wear60"
            },
        },

        {resource: Models.Counter,
            options: {
                navigation: { name: "Wear60", icon: "Building" }, // Group under "Wear60"
            },
        }

    ],

    branding: {
        companyName: "Wear60",
        withMadeWithLove: false,
    },
    defaultTheme:dark.id,
    availableThemes: [dark,light,noSidebar],
    rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword: COOKIE_PASSWORD,
            cookieName: "adminjs",
        },
        app,
        {
            store: sessionStore,
            saveUninitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            },
        }
    );
};
