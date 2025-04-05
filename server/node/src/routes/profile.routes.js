import express from "express";
import {
   updateProfile,
   addStrength,
   removeStrength,
   addWeakness,
   removeWeakness,
   getUserProfile,
} from "../controllers/profile.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(authenticate);

router.put("/update", updateProfile);
router.get("/:userId", getUserProfile);
router.post("/strengths", addStrength);
router.delete("/strengths/:skillId", removeStrength);
router.post("/weaknesses", addWeakness);
router.delete("/weaknesses/:skillId", removeWeakness);

export default router;
