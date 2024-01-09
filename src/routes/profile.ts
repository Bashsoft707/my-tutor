import express from "express"
import { profile } from "../controllers";
import { verifyToken } from "../middlewares";

const router = express.Router();

router.post("/profile", verifyToken, profile.createProfile)

router.get("/profile", verifyToken, profile.getUserProfile)

router.patch("/profile/progress/:id", verifyToken, profile.updateUserProgress)

export default router;