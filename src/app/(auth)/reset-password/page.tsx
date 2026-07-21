"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ResetPasswordSchema, ResetPasswordFormValues } from "@/features/shared/validation/auth";
import { updatePasswordAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const syncRecoverySession = async () => {
      const supabase = createClient();
      // Calling getSession() allows createBrowserClient to parse any URL fragment (#access_token=...) and persist the session cookie
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }
      }
    };
    syncRecoverySession();
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { formState: { isSubmitting, errors }, handleSubmit, register, watch } = form;

  const passwordValue = watch("password");

  useEffect(() => {
    let score = 0;
    if (!passwordValue) {
      setStrength(0);
      return;
    }
    if (passwordValue.length > 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    setStrength(score);
  }, [passwordValue]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const res = await updatePasswordAction(data);
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
        <h2 className="text-2xl font-bold mb-4">Password Reset Successfully</h2>
        <p className="text-muted-foreground mb-8">
          Your password has been successfully updated. You can now use your new password to log in to your enterprise account.
        </p>
        <Link href="/login" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
          Go to Login
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create New Password</h2>
        <p className="text-muted-foreground text-sm">Please choose a strong password to secure your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">New Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Password Strength Meter */}
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={`h-1.5 flex-1 rounded-full transition-colors ${strength >= level ? (strength > 2 ? 'bg-green-500' : 'bg-yellow-500') : 'bg-muted'}`} 
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Password must be at least 8 characters and include uppercase, numbers, and symbols.
          </p>
          {errors.password && (
            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Reset Password"}
        </button>
      </form>
    </motion.div>
  );
}
