import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// Create new answer
export const createAnswer = async (req, res, next) => {
   try {
      const { content } = req.body;
      const { questionId } = req.params;
      const userId = req.user.id;

      // Validate required fields
      if (!content) {
         return errorResponse(res, 400, "Answer content is required");
      }

      // Check if question exists
      const question = await prisma.question.findUnique({
         where: { id: questionId },
      });

      if (!question) {
         return errorResponse(res, 404, "Question not found");
      }

      // Create answer
      const answer = await prisma.answer.create({
         data: {
            content,
            userId,
            questionId,
         },
      });

      return successResponse(res, 201, "Answer created successfully", answer);
   } catch (error) {
      next(error);
   }
};

// Update answer
export const updateAnswer = async (req, res, next) => {
   try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      // Check if answer exists
      const answer = await prisma.answer.findUnique({
         where: { id },
      });

      if (!answer) {
         return errorResponse(res, 404, "Answer not found");
      }

      // Check if user owns the answer
      if (answer.userId !== userId && req.user.role !== "admin") {
         return errorResponse(res, 403, "Not authorized to update this answer");
      }

      // Update answer
      const updatedAnswer = await prisma.answer.update({
         where: { id },
         data: {
            content,
         },
      });

      return successResponse(
         res,
         200,
         "Answer updated successfully",
         updatedAnswer
      );
   } catch (error) {
      next(error);
   }
};

// Delete answer
export const deleteAnswer = async (req, res, next) => {
   try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if answer exists
      const answer = await prisma.answer.findUnique({
         where: { id },
      });

      if (!answer) {
         return errorResponse(res, 404, "Answer not found");
      }

      // Check if user owns the answer
      if (answer.userId !== userId && req.user.role !== "admin") {
         return errorResponse(res, 403, "Not authorized to delete this answer");
      }

      // Delete answer
      await prisma.answer.delete({
         where: { id },
      });

      return successResponse(res, 200, "Answer deleted successfully");
   } catch (error) {
      next(error);
   }
};

// Get answers by question ID
export const getAnswersByQuestion = async (req, res, next) => {
   try {
      const { questionId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Check if question exists
      const question = await prisma.question.findUnique({
         where: { id: questionId },
      });

      if (!question) {
         return errorResponse(res, 404, "Question not found");
      }

      // Get answers for question with author info
      const answers = await prisma.answer.findMany({
         where: { questionId },
         skip,
         take: limit,
         orderBy: {
            createdAt: "asc",
         },
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

      // Get total count for pagination
      const totalAnswers = await prisma.answer.count({
         where: { questionId },
      });

      return successResponse(res, 200, "Answers retrieved successfully", {
         answers,
         pagination: {
            totalAnswers,
            totalPages: Math.ceil(totalAnswers / limit),
            currentPage: page,
            limit,
         },
      });
   } catch (error) {
      next(error);
   }
};

// Get answers by user ID
export const getUserAnswers = async (req, res, next) => {
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

      // Get user answers with question info
      const answers = await prisma.answer.findMany({
         where: { userId },
         skip,
         take: limit,
         orderBy: {
            createdAt: "desc",
         },
         include: {
            question: {
               select: {
                  id: true,
                  title: true,
               },
            },
         },
      });

      // Get total count for pagination
      const totalAnswers = await prisma.answer.count({
         where: { userId },
      });

      return successResponse(res, 200, "User answers retrieved successfully", {
         answers,
         pagination: {
            totalAnswers,
            totalPages: Math.ceil(totalAnswers / limit),
            currentPage: page,
            limit,
         },
      });
   } catch (error) {
      next(error);
   }
};

// Rate a user based on their answer
export const rateUser = async (req, res, next) => {
   try {
      const { answerId } = req.params;
      const { stars } = req.body;
      const raterId = req.user.id;

      // Validate stars
      if (!stars || stars < 1 || stars > 5) {
         return errorResponse(res, 400, "Stars must be between 1 and 5");
      }

      // Get the answer
      const answer = await prisma.answer.findUnique({
         where: { id: answerId },
      });

      if (!answer) {
         return errorResponse(res, 404, "Answer not found");
      }

      const ratedUserId = answer.userId;

      // Check if user is rating themselves
      if (raterId === ratedUserId) {
         return errorResponse(res, 400, "You cannot rate yourself");
      }

      // Calculate XP to award (stars * 10)
      const xpAwarded = stars * 10;

      // Check if rating already exists
      const existingRating = await prisma.rating.findFirst({
         where: {
            raterId,
            ratedUserId,
         },
      });

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (prisma) => {
         let rating;
         let xpDifference = xpAwarded;

         if (existingRating) {
            // Calculate XP difference for update
            xpDifference = xpAwarded - existingRating.xpAwarded;

            // Update existing rating
            rating = await prisma.rating.update({
               where: { id: existingRating.id },
               data: {
                  stars,
                  xpAwarded,
               },
            });
         } else {
            // Create new rating
            rating = await prisma.rating.create({
               data: {
                  raterId,
                  ratedUserId,
                  stars,
                  xpAwarded,
               },
            });
         }

         // Update user's XP points
         const updatedUser = await prisma.user.update({
            where: { id: ratedUserId },
            data: {
               xp_points: {
                  increment: xpDifference,
               },
            },
            select: {
               id: true,
               username: true,
               xp_points: true,
            },
         });

         return { rating, updatedUser };
      });

      return successResponse(res, 200, "User rated successfully", result);
   } catch (error) {
      next(error);
   }
};
