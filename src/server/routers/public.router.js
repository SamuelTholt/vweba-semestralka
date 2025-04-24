import express from "express";
import publicController from "../controllers/public.controller.js";
const router = express.Router();

router.post("/signUp", publicController.signUp);
router.post("/signIn", publicController.signIn);

export default router;