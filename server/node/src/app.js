import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import globalErrorHandler from "./middleware/globalErrorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import questionRoutes from "./routes/question.routes.js";
import answerRoutes from "./routes/answer.routes.js";
import matchP2p from "./routes/p2p.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
   "http://localhost:5173",
   "http://192.168.151.58:5173",
   process.env.FRONTEND_URL, // optional env
].filter(Boolean); // remove undefined/null

app.use(
   cors({
      origin: function (origin, callback) {
         if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
         } else {
            callback(new Error("CORS not allowed for this origin: " + origin));
         }
      },
      credentials: true,
   })
);
export const prisma = new PrismaClient();

// Routes
app.get("/", (req, res, next) => {
   res.status(200).json({
      message: "Express Server built using create-xpress-starter",
   });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

app.use("/api/p2p", matchP2p);

// Error handling middleware
app.use(errorHandler);

// Global Error Handler
app.use(globalErrorHandler);

process.on("SIGINT", async () => {
   await prisma.$disconnect();
   process.exit(0);
});

export default app;
