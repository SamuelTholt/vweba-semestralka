import express from "express";
import menuController from "../controllers/menu.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", adminMiddleware ,menuController.createMenuItem);

export default router;