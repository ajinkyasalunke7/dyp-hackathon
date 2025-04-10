// RegisterPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import apiRequest from "../../utils/apiRequest";
import { enqueueSnackbar } from "notistack";
import { Link, useNavigate } from "react-router";

const registerSchema = z.object({
   fullname: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters" }),
   username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
   email: z.string().email({ message: "Invalid email address" }),
   password: z
      .string()
      .min(3, { message: "Password must be at least 6 characters" }),
});

const RegisterPage = () => {
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(registerSchema),
   });

   const onSubmit = async (data) => {
      console.log("Registering:", data);
      try {
         const result = await apiRequest("post", "/api/auth/register", data);
         // console.log("Post successful:", result);
         if (result.data == false) {
            enqueueSnackbar(result.message, {
               autoHideDuration: 2000,
               variant: "error",
            });
         }
         if (result.success == true) {
            enqueueSnackbar(result.message, {
               autoHideDuration: 2000,
               variant: "success",
            });
         }
         navigate("/login");
      } catch (error) {
         enqueueSnackbar(error, { autoHideDuration: 3000, variant: "error" });
      }
      // await new Promise((resolve) => setTimeout(resolve, 3000));
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
               Register
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 text-sm font-semibold mb-2"
                     htmlFor="fullname"
                  >
                     Full Name
                  </label>
                  <input
                     {...register("fullname")}
                     className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.fullname ? "border-red-500" : ""
                     }`}
                     id="fullname"
                     type="text"
                     placeholder="Full Name"
                  />
                  {errors.fullname && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.fullname.message}
                     </p>
                  )}
               </div>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 text-sm font-semibold mb-2"
                     htmlFor="username"
                  >
                     Username
                  </label>
                  <input
                     {...register("username")}
                     className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.username ? "border-red-500" : ""
                     }`}
                     id="username"
                     type="text"
                     placeholder="Username"
                  />
                  {errors.username && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.username.message}
                     </p>
                  )}
               </div>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 text-sm font-semibold mb-2"
                     htmlFor="email"
                  >
                     Email
                  </label>
                  <input
                     {...register("email")}
                     className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.email ? "border-red-500" : ""
                     }`}
                     id="email"
                     type="email"
                     placeholder="Email"
                  />
                  {errors.email && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                     </p>
                  )}
               </div>
               <div className="mb-8">
                  <label
                     className="block text-gray-700 text-sm font-semibold mb-2"
                     htmlFor="password"
                  >
                     Password
                  </label>
                  <input
                     {...register("password")}
                     className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.password ? "border-red-500" : ""
                     }`}
                     id="password"
                     type="password"
                     placeholder="Password"
                  />
                  {errors.password && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                     </p>
                  )}
               </div>
               <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
               >
                  {isSubmitting ? (
                     <Loader2 className="animate-spin mr-2 inline" />
                  ) : (
                     "Register"
                  )}
               </button>
            </form>
            <Link to={"/login"}>
               <div className="mt-4 flex flex-row">
                  <span>Already have an account?</span>
                  &nbsp;
                  <h1 className="underline text-blue-600">Login here!</h1>
               </div>
            </Link>
         </div>
      </div>
   );
};

export default RegisterPage;
