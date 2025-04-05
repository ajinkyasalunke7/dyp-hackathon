import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app.js";
import { successResponse, errorResponse } from "../utils/responses.js";

// Register a new user
export const register = async (req, res, next) => {
   try {
      const { username, email, password } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
         return errorResponse(
            res,
            400,
            "Username, email and password are required"
         );
      }

      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
         where: {
            OR: [{ username }, { email }],
         },
      });

      if (existingUser) {
         return errorResponse(res, 409, "Username or email already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await prisma.user.create({
         data: {
            username,
            email,
            password: hashedPassword,
         },
      });

      // Generate JWT token
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
         expiresIn: "30d",
      });

      // Set token in cookie
      res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Send response without password
      const { password: _, ...userWithoutPassword } = newUser;

      return successResponse(
         res,
         201,
         "User registered successfully",
         userWithoutPassword
      );
   } catch (error) {
      next(error);
   }
};

// Login user
export const login = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
         return errorResponse(res, 400, "Email and password are required");
      }

      // Find user by email
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         return errorResponse(res, 401, "Invalid credentials");
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return errorResponse(res, 401, "Invalid credentials");
      }

      // Update user status to online
      await prisma.user.update({
         where: { id: user.id },
         data: { currentStatus: "online" },
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
         expiresIn: "30d",
      });

      // Set token in cookie
      res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Send response without password
      const { password: _, ...userWithoutPassword } = user;

      return successResponse(res, 200, "Login successful", userWithoutPassword);
   } catch (error) {
      next(error);
   }
};

// Logout user
export const logout = async (req, res, next) => {
   try {
      // Get user ID from token if available
      const token = req.cookies.token;
      if (token) {
         try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Update user status to offline
            await prisma.user.update({
               where: { id: decoded.id },
               data: { currentStatus: "offline" },
            });
         } catch (err) {
            // If token is invalid, just clear the cookie
         }
      }

      // Clear cookie
      res.cookie("token", "", {
         httpOnly: true,
         expires: new Date(0),
      });

      return successResponse(res, 200, "Logged out successfully");
   } catch (error) {
      next(error);
   }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
   try {
      const { password, ...userWithoutPassword } = req.user;
      console.log(req.user);

      return successResponse(
         res,
         200,
         "User retrieved successfully",
         userWithoutPassword
      );
      // return re;
   } catch (error) {
      next(error);
   }
};
