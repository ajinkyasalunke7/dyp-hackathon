import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { errorResponse } from "../utils/responses.js";

export const authenticate = async (req, res, next) => {
   try {
      const token = req.cookies.token;

      if (!token) {
         return errorResponse(res, 401, "Authentication required");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
         where: { id: decoded.id },
      });

      if (!user) {
         return errorResponse(res, 404, "User not found");
      }

      req.user = user;
      next();
   } catch (error) {
      if (error.name === "TokenExpiredError") {
         return errorResponse(res, 401, "Session expired, please login again");
      }
      return errorResponse(res, 401, "Invalid authentication token");
   }
};

export const isAdmin = (req, res, next) => {
   if (req.user.role !== "admin") {
      return errorResponse(
         res,
         403,
         "Access denied. Admin privileges required"
      );
   }
   next();
};
