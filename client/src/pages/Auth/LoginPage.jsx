import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Assuming you have these components from a UI library like shadcn/ui
// If not, you'll need to install them or create your own versions
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "./components/ui/card";

// Import icons from lucide-react or another icon library
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

const loginSchema = z.object({
   identifier: z
      .string()
      .min(3, { message: "Email or Username must be at least 3 characters" }),
   password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginPage = () => {
   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(loginSchema),
   });

   const onSubmit = async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Logging in:", data);
   };

   return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
         {/* Background elements */}
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
               <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
               <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
               <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
               <div className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            </div>
            <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat opacity-[0.03]"></div>
         </div>

         {/* Login card */}
         <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">
                  Welcome back
               </CardTitle>
               <CardDescription className="text-center">
                  Enter your credentials to sign in to your account
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                           {...register("identifier")}
                           className={`pl-10 h-12 ${
                              errors.identifier
                                 ? "border-red-500 focus:ring-red-500"
                                 : ""
                           }`}
                           id="identifier"
                           type="text"
                           placeholder="Email or Username"
                           aria-invalid={errors.identifier ? "true" : "false"}
                        />
                     </div>
                     {errors.identifier && (
                        <p className="text-red-500 text-sm" role="alert">
                           {errors.identifier.message}
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                           {...register("password")}
                           className={`pl-10 h-12 ${
                              errors.password
                                 ? "border-red-500 focus:ring-red-500"
                                 : ""
                           }`}
                           id="password"
                           type="password"
                           placeholder="Password"
                           aria-invalid={errors.password ? "true" : "false"}
                        />
                     </div>
                     {errors.password && (
                        <p className="text-red-500 text-sm" role="alert">
                           {errors.password.message}
                        </p>
                     )}
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        <input
                           type="checkbox"
                           id="remember"
                           className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label
                           htmlFor="remember"
                           className="text-sm text-gray-600"
                        >
                           Remember me
                        </label>
                     </div>
                     <a
                        href="/forgot-password"
                        className="text-sm font-medium text-purple-600 hover:text-purple-500"
                     >
                        Forgot password?
                     </a>
                  </div>

                  <Button
                     className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300"
                     type="submit"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Signing in...
                        </>
                     ) : (
                        <>
                           Sign in
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                     )}
                  </Button>
               </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-white px-2 text-gray-500">
                        Or continue with
                     </span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11">
                     <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                           fill="#4285F4"
                        />
                        <path
                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                           fill="#34A853"
                        />
                        <path
                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                           fill="#FBBC05"
                        />
                        <path
                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                           fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                     </svg>
                     Google
                  </Button>
                  <Button variant="outline" className="h-11">
                     <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                     </svg>
                     Facebook
                  </Button>
               </div>

               <p className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <a
                     href="/signup"
                     className="font-medium text-purple-600 hover:text-purple-500"
                  >
                     Sign up
                  </a>
               </p>
            </CardFooter>
         </Card>
      </div>
   );
};

export default LoginPage;
