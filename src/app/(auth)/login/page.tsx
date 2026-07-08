"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { LoginSchema, LoginFormValues } from "@/features/shared/validation/auth";
import { signInAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { formState: { isSubmitting, errors }, handleSubmit, register } = form;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await signInAction(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Successfully logged in!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-card border shadow-2xl rounded-3xl backdrop-blur-sm"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-muted-foreground text-sm">Sign in to your enterprise account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            {...register("rememberMe")}
            id="rememberMe"
            type="checkbox"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground">
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </motion.div>
  );
}