import express from "express";
import menuController from "../controllers/menu.controller.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create" , adminMiddleware, menuController.createMenuItem);
router.get("/", menuController.getMenuItemsByCategory);
router.put("/edit/:id", adminMiddleware, menuController.editMenuItem);
router.delete("/delete/:id", adminMiddleware, menuController.deleteMenuItem);

export default router;