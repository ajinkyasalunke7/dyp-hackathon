import { errorResponse } from "../utils/responses.js";

export const errorHandler = (err, req, res, next) => {
   console.error(err.stack);

   // Handle Prisma-specific errors
   if (err.code) {
      switch (err.code) {
         case "P2002": // Unique constraint violation
            return errorResponse(
               res,
               409,
               `A record with this ${err.meta?.target} already exists`
            );
         case "P2025": // Record not found
            return errorResponse(res, 404, "Record not found");
         case "P2003": // Foreign key constraint failed
            return errorResponse(res, 400, "Related record does not exist");
         default:
            break;
      }
   }

   // Default error response
   const statusCode = err.statusCode || 500;
   const message = err.message || "Internal server error";
   return errorResponse(res, statusCode, message);
};
