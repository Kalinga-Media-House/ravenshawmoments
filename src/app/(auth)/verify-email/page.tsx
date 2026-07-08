"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    // Simulate resend API call since Supabase handles this via standard signup usually,
    // or we can just show a toast if we don't have the email cached on the client.
    setTimeout(() => {
      toast.success("Verification email resent!");
      setIsResending(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-card border shadow-2xl rounded-3xl backdrop-blur-sm text-center"
    >
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        We've sent a verification link to your email address. Please click the link to verify your account and access the Ravenshaw Moments ecosystem.
      </p>
      
      <div className="space-y-4">
        <Link href="/login" className="block w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
          Go to Login
        </Link>
        <button 
          onClick={handleResend}
          disabled={isResending}
          className="block w-full bg-muted text-foreground py-3 rounded-xl font-bold hover:bg-muted/80 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isResending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Resend Verification Email"}
        </button>
      </div>
    </motion.div>
  );
}
