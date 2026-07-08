"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { ForgotPasswordSchema, ForgotPasswordFormValues } from "@/features/shared/validation/auth";
import { resetPasswordRequestAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { formState: { isSubmitting, errors }, handleSubmit, register } = form;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const res = await resetPasswordRequestAction(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-card border shadow-2xl rounded-3xl backdrop-blur-sm text-center"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold mb-4">Check Your Inbox</h2>
        <p className="text-muted-foreground mb-8">
          We've sent a password reset link to your email. Click the link to securely reset your password.
        </p>
        <Link href="/login" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
          Return to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-card border shadow-2xl rounded-3xl backdrop-blur-sm"
    >
      <div className="mb-8">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        <p className="text-muted-foreground text-sm">Enter your registered email address to receive a password reset link.</p>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Send Reset Link"}
        </button>
      </form>
    </motion.div>
  );
}
