import express from "express"
import mongoose from "mongoose";
import cors from "cors";

import { config } from "dotenv";

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