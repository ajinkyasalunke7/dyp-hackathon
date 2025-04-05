import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// Create new blog
export const createBlog = async (req, res, next) => {
   try {
      const { title, content } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!title || !content) {
         return errorResponse(res, 400, "Title and content are required");
      }

      // Create blog
      const blog = await prisma.blog.create({
         data: {
            title,
            content,
            userId,
         },
      });

      return successResponse(res, 201, "Blog created successfully", blog);
   } catch (error) {
      next(error);
   }
};

// Update blog
export const updateBlog = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user.id;

      // Check if blog exists
      const blog = await prisma.blog.findUnique({
         where: { id },
      });

      if (!blog) {
         return errorResponse(res, 404, "Blog not found");
      }

      // Check if user owns the blog
      if (blog.userId !== userId && req.user.role !== "admin") {
         return errorResponse(res, 403, "Not authorized to update this blog");
      }

      // Update blog
      const updatedBlog = await prisma.blog.update({
         where: { id },
         data: {
            title,
            content,
         },
      });

      return successResponse(
         res,
         200,
         "Blog updated successfully",
         updatedBlog
      );
   } catch (error) {
      next(error);
   }
};

// Delete blog
export const deleteBlog = async (req, res, next) => {
   try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if blog exists
      const blog = await prisma.blog.findUnique({
         where: { id },
      });

      if (!blog) {
         return errorResponse(res, 404, "Blog not found");
      }

      // Check if user owns the blog
      if (blog.userId !== userId && req.user.role !== "admin") {
         return errorResponse(res, 403, "Not authorized to delete this blog");
      }

      // Delete blog
      await prisma.blog.delete({
         where: { id },
      });

      return successResponse(res, 200, "Blog deleted successfully");
   } catch (error) {
      next(error);
   }
};

// Get all blogs with pagination
export const getAllBlogs = async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Get blogs with author info
      const blogs = await prisma.blog.findMany({
         skip,
         take: limit,
         orderBy: {
            createdAt: "desc",
         },
         include: {
            user: {
               select: {
                  id: true,
                  username: true,
                  profession: true,
               },
            },
         },
      });

      // Get total count for pagination
      const totalBlogs = await prisma.blog.count();

      return successResponse(res, 200, "Blogs retrieved successfully", {
         blogs,
         pagination: {
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            limit,
         },
      });
   } catch (error) {
      next(error);
   }
};

// Get blog by ID
export const getBlogById = async (req, res, next) => {
   try {
      const { id } = req.params;

      const blog = await prisma.blog.findUnique({
         where: { id },
         include: {
            user: {
               select: {
                  id: true,
                  username: true,
                  profession: true,
                  xp_points: true,
               },
            },
         },
      });

      if (!blog) {
         return errorResponse(res, 404, "Blog not found");
      }

      return successResponse(res, 200, "Blog retrieved successfully", blog);
   } catch (error) {
      next(error);
   }
};

// Get blogs by user ID
export const getUserBlogs = async (req, res, next) => {
   try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Check if user exists
      const user = await prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         return errorResponse(res, 404, "User not found");
      }

      // Get user blogs
      const blogs = await prisma.blog.findMany({
         where: { userId },
         skip,
         take: limit,
         orderBy: {
            createdAt: "desc",
         },
      });

      // Get total count for pagination
      const totalBlogs = await prisma.blog.count({
         where: { userId },
      });

      return successResponse(res, 200, "User blogs retrieved successfully", {
         blogs,
         pagination: {
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page,
            limit,
         },
      });
   } catch (error) {
      next(error);
   }
};
