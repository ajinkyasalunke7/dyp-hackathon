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

export const addStrength = async (req, res, next) => {
   try {
      const { skill } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(skill) || skill.length === 0) {
         return errorResponse(res, 400, "Skill must be a non-empty array");
      }

      const normalizedSkills = [
         ...new Set(skill.map((s) => s.toLowerCase().trim())),
      ];

      // Find existing skills for the user
      const existingSkills = await prisma.userStrength.findMany({
         where: {
            userId,
            skill: {
               in: normalizedSkills,
            },
         },
      });

      const existingSkillSet = new Set(existingSkills.map((s) => s.skill));

      // Filter skills not already in DB
      const newSkills = normalizedSkills.filter(
         (s) => !existingSkillSet.has(s)
      );

      if (newSkills.length === 0) {
         return errorResponse(
            res,
            409,
            "All provided skills already exist in your strengths"
         );
      }

      // Add new skills
      const addedSkills = await prisma.$transaction(
         newSkills.map((s) =>
            prisma.userStrength.create({
               data: {
                  userId,
                  skill: s,
               },
            })
         )
      );

      return successResponse(
         res,
         201,
         "New skills added successfully",
         addedSkills
      );
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

      if (!Array.isArray(skill) || skill.length === 0) {
         return errorResponse(res, 400, "Skill must be a non-empty array");
      }

      // Normalize & deduplicate skills
      const normalizedSkills = [
         ...new Set(skill.map((s) => s.toLowerCase().trim())),
      ];

      // Find existing weaknesses for the user
      const existingWeaknesses = await prisma.userWeakness.findMany({
         where: {
            userId,
            skill: {
               in: normalizedSkills,
            },
         },
      });

      const existingSet = new Set(existingWeaknesses.map((w) => w.skill));

      // Filter new skills
      const newSkills = normalizedSkills.filter((s) => !existingSet.has(s));

      if (newSkills.length === 0) {
         return errorResponse(
            res,
            409,
            "All provided skills already exist in your weaknesses"
         );
      }

      // Insert new weaknesses
      const addedWeaknesses = await prisma.$transaction(
         newSkills.map((s) =>
            prisma.userWeakness.create({
               data: {
                  userId,
                  skill: s,
               },
            })
         )
      );

      return successResponse(
         res,
         201,
         "Weaknesses added successfully",
         addedWeaknesses
      );
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
