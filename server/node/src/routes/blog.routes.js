import express from "express";
import {
   createBlog,
   updateBlog,
   deleteBlog,
   getAllBlogs,
   getBlogById,
   getUserBlogs,
} from "../controllers/blog.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.get("/user/:userId", getUserBlogs);

// Protected routes
router.use(authenticate);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
