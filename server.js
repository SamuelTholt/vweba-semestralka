import express from "express"
import mongoose from "mongoose";
import cors from "cors";
import publicRoutes from "./src/server/routers/public.router.js";
import reviewsRoutes from "./src/server/routers/reviews.router.js";
import menuRoutes from "./src/server/routers/menu.router.js";

import { config } from "dotenv";
import authMiddleware from "./src/server/middleware/auth.middleware.js";


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

if (!process.env.API_KEY) {
    console.log("API_KEY is missing!");
    process.exit(1);
}

if (!process.env.mongoURL) {
    console.log("MongoURL is missing!");
    process.exit(1);
}


const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-access-token");
    next();
});

// Získanie adresára, kde sa nachádza súbor
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nastavenie statického adresára pre obrázky
app.use("/images", express.static(join(__dirname, "public", "images")));

app.use(authMiddleware);
app.use("/public", publicRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/menu", menuRoutes);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

app.use((error, req, res, next) => {
    console.error("Caught error:", error.message);
    res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

app.use((req, res, next) => {
    res.status(404).send({message: "No route found! "});
});

const start = async () => {
    try {
        await mongoose.connect(process.env.mongoURL);
        console.log("You are connected to MongoDB: ", process.env.mongoURL);
    } catch (error) {
        console.error(`${error.message}, can not connect to mongoDB: ${process.env.mongoURL} Existing!`);
        return -1;
    }
    app.listen(process.env.PORT, () => {
        console.log("Pocuvanie na porte: " + process.env.PORT);
    })
}

start();