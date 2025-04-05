import express from "express";
import { authenticate } from "../middleware/auth.js";
import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

const router = express.Router();

router.post("/match", authenticate, async (req, res) => {
   const { weakness } = req.body;

   if (!weakness || typeof weakness !== "string") {
      return errorResponse(
         res,
         400,
         "Weakness is required and must be a string"
      );
   }

   try {
      const normalizedWeakness = weakness.toLowerCase();
      console.log(`Searching for users with strength: ${normalizedWeakness}`);

      // Log all online users and their strengths for debugging
      const onlineUsers = await prisma.user.findMany({
         where: {
            currentStatus: "online",
            NOT: { id: req.user?.id },
         },
         // include: {
         //    strengths: true,
         // },
      });
      console.log(
         "Online users with strengths:",
         JSON.stringify(onlineUsers, null, 2)
      );

      // Find matching users
      const matchedUsers = await prisma.user.findMany({
         where: {
            currentStatus: "online",
            strengths: {
               some: {
                  skill: normalizedWeakness, // Match the weakness with a strength
               },
            },
            NOT: {
               id: req.user?.id, // Exclude the current user
            },
         },
         select: {
            id: true,
            username: true,
            xp_points: true,
         },
         orderBy: {
            xp_points: "desc", // Sort by xp_points, highest first
         },
      });

      if (matchedUsers.length === 0) {
         console.log(`No matches found for weakness: ${normalizedWeakness}`);
         return errorResponse(
            res,
            404,
            "No online users found with the matching strength"
         );
      }

      console.log("Matched users:", matchedUsers);
      return successResponse(res, 200, "Matching peers found", {
         matchedUsers: matchedUsers.map((user) => ({
            id: user.id,
            username: user.username,
            xp_points: user.xp_points,
         })),
      });
   } catch (error) {
      console.error("Error in /match:", error);
      return errorResponse(res, 500, "Internal server error");
   }
});

// POST /api/messages (Send a message)
router.post("/messages", async (req, res) => {
   const { receiverId, content } = req.body;
   const io = req.app.get("io"); // Access io instance for WebSocket

   if (!receiverId || !content) {
      return errorResponse(res, 400, "Receiver ID and content are required");
   }

   try {
      const message = await prisma.message.create({
         data: {
            content,
            senderId: req.user.id,
            receiverId,
            status: "sent",
         },
      });

      // Emit message to receiver's room (if WebSocket is set up)
      if (io) {
         io.to(receiverId).emit("newMessage", message);
      }

      return successResponse(res, 201, "Message sent", message);
   } catch (error) {
      console.error("Error sending message:", error);
      return errorResponse(res, 500, "Internal server error");
   }
});

// GET /api/messages/:userId (Get chat history)
router.get("/messages/:userId", async (req, res) => {
   const { userId } = req.params;

   try {
      const messages = await prisma.message.findMany({
         where: {
            OR: [
               { senderId: req.user.id, receiverId: userId },
               { senderId: userId, receiverId: req.user.id },
            ],
         },
         orderBy: {
            createdAt: "asc", // Oldest first
         },
      });

      // Update status to "delivered" for received messages
      await prisma.message.updateMany({
         where: {
            receiverId: req.user.id,
            senderId: userId,
            status: "sent",
         },
         data: { status: "delivered" },
      });

      return successResponse(res, 200, "Chat history retrieved", messages);
   } catch (error) {
      console.error("Error fetching messages:", error);
      return errorResponse(res, 500, "Internal server error");
   }
});

// PUT /api/messages/read/:userId (Mark messages as read)
router.put("/messages/read/:userId", async (req, res) => {
   const { userId } = req.params;

   try {
      const updated = await prisma.message.updateMany({
         where: {
            receiverId: req.user.id,
            senderId: userId,
            status: { in: ["sent", "delivered"] },
         },
         data: { status: "read" },
      });

      if (updated.count === 0) {
         return successResponse(res, 200, "No messages to mark as read");
      }

      return successResponse(res, 200, "Messages marked as read");
   } catch (error) {
      console.error("Error marking messages as read:", error);
      return errorResponse(res, 500, "Internal server error");
   }
});

export default router;
