import express from "express";
import publicController from "../controllers/public.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signUp", publicController.signUp);
router.post("/signIn", publicController.signIn);

router.get('/users', authMiddleware, publicController.getAllUsers);
router.put('/users/:userId/role', authMiddleware, publicController.changeUserRole);
router.get('/user/me', publicController.getCurrentUser);

export default router;