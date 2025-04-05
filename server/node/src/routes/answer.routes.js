import express from "express";
import {
   createAnswer,
   updateAnswer,
   deleteAnswer,
   getAnswersByQuestion,
   getUserAnswers,
   rateUser,
} from "../controllers/answer.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/question/:questionId", getAnswersByQuestion);
router.get("/user/:userId", getUserAnswers);

// Protected routes
router.use(authenticate);
router.post("/question/:questionId", createAnswer);
router.put("/:id", updateAnswer);
router.delete("/:id", deleteAnswer);
router.post("/rate/:answerId", rateUser);

export default router;
