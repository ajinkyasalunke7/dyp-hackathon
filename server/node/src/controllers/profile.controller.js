import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// Update user profile
export const updateProfile = async (req, res, next) => {
   try {
      const { profession, currentStatus } = req.body;
      const userId = req.user.id;

      // Update user profile
      const updatedUser = await prisma.user.update({
         where: { id: userId },
         data: {
            profession,
            currentStatus,
         },
         select: {
            id: true,
            username: true,
            email: true,
            profession: true,
            xp_points: true,
            currentStatus: true,
            role: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      return successResponse(
         res,
         200,
         "Profile updated successfully",
         updatedUser
      );
   } catch (error) {
      next(error);
   }
};

// Get user profile with strengths and weaknesses
export const getUserProfile = async (req, res, next) => {
   try {
      const { userId } = req.params;
      console.log(userId);
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: {
            id: true,
            username: true,
            email: true,
            profession: true,
            xp_points: true,
            currentStatus: true,
            role: true,
            createdAt: true,
            strengths: true,
            weaknesses: true,
         },
      });

      if (!user) {
         return errorResponse(res, 404, "User not found");
      }

      return successResponse(
         res,
         200,
         "User profile retrieved successfully",
         user
      );
   } catch (error) {
      next(error);
   }
};

// Add a strength to user profile
export const addStrength = async (req, res, next) => {
   try {
      const { skill } = req.body;
      const userId = req.user.id;

      if (!skill) {
         return errorResponse(res, 400, "Skill is required");
      }

      // Check if strength already exists
      const existingStrength = await prisma.userStrength.findFirst({
         where: {
            userId,
            skill,
         },
      });

      if (existingStrength) {
         return errorResponse(
            res,
            409,
            "This skill is already in your strengths"
         );
      }

      // Add strength
      const strength = await prisma.userStrength.create({
         data: {
            skill: skill.toLowerCase(),
            userId,
         },
      });

      return successResponse(res, 201, "Strength added successfully", strength);
   } catch (error) {
      next(error);
   }
};

// Remove a strength from user profile
export const removeStrength = async (req, res, next) => {
   try {
      const { skillId } = req.params;
      const userId = req.user.id;

      // Check if strength exists and belongs to user
      const strength = await prisma.userStrength.findUnique({
         where: { id: skillId },
      });

      if (!strength || strength.userId !== userId) {
         return errorResponse(res, 404, "Strength not found");
      }

      // Delete strength
      await prisma.userStrength.delete({
         where: { id: skillId },
      });

      return successResponse(res, 200, "Strength removed successfully");
   } catch (error) {
      next(error);
   }
};

// Add a weakness to user profile
export const addWeakness = async (req, res, next) => {
   try {
      const { skill } = req.body;
      const userId = req.user.id;

      if (!skill) {
         return errorResponse(res, 400, "Skill is required");
      }

      // Check if weakness already exists
      const existingWeakness = await prisma.userWeakness.findFirst({
         where: {
            userId,
            skill,
         },
      });

      if (existingWeakness) {
         return errorResponse(
            res,
            409,
            "This skill is already in your weaknesses"
         );
      }

      // Add weakness
      const weakness = await prisma.userWeakness.create({
         data: {
            skill,
            userId,
         },
      });

      return successResponse(res, 201, "Weakness added successfully", weakness);
   } catch (error) {
      next(error);
   }
};

// Remove a weakness from user profile
export const removeWeakness = async (req, res, next) => {
   try {
      const { skillId } = req.params;
      const userId = req.user.id;

      // Check if weakness exists and belongs to user
      const weakness = await prisma.userWeakness.findUnique({
         where: { id: skillId },
      });

      if (!weakness || weakness.userId !== userId) {
         return errorResponse(res, 404, "Weakness not found");
      }

      // Delete weakness
      await prisma.userWeakness.delete({
         where: { id: skillId },
      });

      return successResponse(res, 200, "Weakness removed successfully");
   } catch (error) {
      next(error);
   }
};
