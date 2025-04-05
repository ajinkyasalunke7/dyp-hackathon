import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// Create new question
export const createQuestion = async (req, res, next) => {
   try {
      const { title, content } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!title || !content) {
         return errorResponse(res, 400, "Title and content are required");
      }

      // Create question
      const question = await prisma.question.create({
         data: {
            title,
            content,
            userId,
         },
      });

      return successResponse(
         res,
         201,
         "Question created successfully",
         question
      );
   } catch (error) {
      next(error);
   }
};

// Update question
export const updateQuestion = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user.id;

      // Check if question exists
      const question = await prisma.question.findUnique({
         where: { id },
      });

      if (!question) {
         return errorResponse(res, 404, "Question not found");
      }

      // Check if user owns the question
      if (question.userId !== userId && req.user.role !== "admin") {
         return errorResponse(
            res,
            403,
            "Not authorized to update this question"
         );
      }

      // Update question
      const updatedQuestion = await prisma.question.update({
         where: { id },
         data: {
            title,
            content,
         },
      });

      return successResponse(
         res,
         200,
         "Question updated successfully",
         updatedQuestion
      );
   } catch (error) {
      next(error);
   }
};

// Delete question
export const deleteQuestion = async (req, res, next) => {
   try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if question exists
      const question = await prisma.question.findUnique({
         where: { id },
      });

      if (!question) {
         return errorResponse(res, 404, "Question not found");
      }

      // Check if user owns the question
      if (question.userId !== userId && req.user.role !== "admin") {
         return errorResponse(
            res,
            403,
            "Not authorized to delete this question"
         );
      }

      // Delete question (cascade will delete answers)
      await prisma.question.delete({
         where: { id },
      });

      return successResponse(res, 200, "Question deleted successfully");
   } catch (error) {
      next(error);
   }
};

// Get all questions with pagination and filtering
export const getAllQuestions = async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";

      // Build search filter
      const searchFilter = search
         ? {
              OR: [
                 { title: { contains: search, mode: "insensitive" } },
                 { content: { contains: search, mode: "insensitive" } },
              ],
           }
         : {};

      // Get questions with author info and answer count
      const questions = await prisma.question.findMany({
         where: searchFilter,
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
            _count: {
               select: { answers: true },
            },
         },
      });

      // Get total count for pagination
      const totalQuestions = await prisma.question.count({
         where: searchFilter,
      });

      return successResponse(res, 200, "Questions retrieved successfully", {
         questions,
         pagination: {
            totalQuestions,
            totalPages: Math.ceil(totalQuestions / limit),
            currentPage: page,
            limit,
         },
      });
   } catch (error) {
      next(error);
   }
};

// Get question by ID with answers
export const getQuestionById = async (req, res, next) => {
   try {
      const { id } = req.params;

      const question = await prisma.question.findUnique({
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
            answers: {
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
               orderBy: {
                  createdAt: "asc",
               },
            },
         },
      });

      if (!question) {
         return errorResponse(res, 404, "Question not found");
      }

      return successResponse(
         res,
         200,
         "Question retrieved successfully",
         question
      );
   } catch (error) {
      next(error);
   }
};

// Get questions by user ID
export const getUserQuestions = async (req, res, next) => {
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

      // Get user questions with answer count
      const questions = await prisma.question.findMany({
         where: { userId },
         skip,
         take: limit,
         orderBy: {
            createdAt: "desc",
         },
         include: {
            _count: {
               select: { answers: true },
            },
         },
      });

      // Get total count for pagination
      const totalQuestions = await prisma.question.count({
         where: { userId },
      });

      return successResponse(
         res,
         200,
         "User questions retrieved successfully",
         {
            questions,
            pagination: {
               totalQuestions,
               totalPages: Math.ceil(totalQuestions / limit),
               currentPage: page,
               limit,
            },
         }
      );
   } catch (error) {
      next(error);
   }
};
