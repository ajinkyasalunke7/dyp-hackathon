// LoginPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import apiRequest from "../../utils/apiRequest";
import { Link, useNavigate } from "react-router-dom";

const loginSchema = z.object({
   usernameOrEmail: z
      .string()
      .min(1, { message: "Username or Email is required" }),
   password: z
      .string()
      .min(3, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
   const navigate = useNavigate();
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(loginSchema),
   });

   // const onSubmit = async (data) => {
   //    await new Promise((resolve) => setTimeout(resolve, 1000));
   //    console.log("Logging in:", data);
   // };

   const onSubmit = async (data) => {
      console.log("Registering:", data);
      try {
         const result = await apiRequest("post", "/api/auth/login", data);
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
            navigate("/update-profile");
         }
      } catch (error) {
         enqueueSnackbar(error, { autoHideDuration: 3000, variant: "error" });
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
         <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
               Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 text-sm font-semibold mb-2"
                     htmlFor="usernameOrEmail"
                  >
                     Username or Email
                  </label>
                  <input
                     {...register("usernameOrEmail")}
                     className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                        errors.usernameOrEmail ? "border-red-500" : ""
                     }`}
                     id="usernameOrEmail"
                     type="text"
                     placeholder="Username or Email"
                  />
                  {errors.usernameOrEmail && (
                     <p className="text-red-500 text-xs mt-1">
                        {errors.usernameOrEmail.message}
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
                     "Login"
                  )}
               </button>
            </form>
            <Link to={"/register"}>
               <div className="mt-4 flex flex-row">
                  <span>Don't have account?</span>
                  &nbsp;
                  <h1 className="underline text-blue-600">Create here!</h1>
               </div>
            </Link>
         </div>
      </div>
   );
};

export default LoginPage;
