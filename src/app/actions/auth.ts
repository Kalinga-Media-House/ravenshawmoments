"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import {
  RegisterSchema,
  RegisterFormValues,
  LoginSchema,
  LoginFormValues,
  ForgotPasswordSchema,
  ForgotPasswordFormValues,
  ResetPasswordSchema,
  ResetPasswordFormValues,
} from "@/features/shared/validation/auth";

export type AuthResponse = {
  success?: boolean;
  error?: string;
};

export async function signUpAction(data: RegisterFormValues): Promise<AuthResponse> {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const supabase = await createClient();

  const { email, password, fullName, role, department, entryYear, exitYear, stream, hostel, gender, universityName, currentProfession, designation, joiningYear, isRavenshawvian, level } = parsed.data;

  // Map metadata exactly for the auth.users raw_user_meta_data
  const metadata: Record<string, any> = {
    full_name: fullName,
    role: role,
    is_ravenshawvian: isRavenshawvian === "Yes",
  };

  if (isRavenshawvian === "Yes") {
    if (role === "student" || role === "alumni") {
      metadata.level = level;
      if (level === "+2") {
        metadata.stream = stream;
        metadata.batch = `${entryYear}-${parseInt(entryYear || "0") + 2}`;
        metadata.department = null; // Explicitly null for +2
        metadata.hostel = null;     // Explicitly null for +2
      } else {
        metadata.department = department;
        metadata.batch = `${entryYear}-${exitYear}`;
      }
    }
    if (role === "student") {
      metadata.hostel = hostel;
      metadata.gender = gender;
    }
    if (role === "alumni") {
      metadata.current_profession = currentProfession;
    }
    if (role === "teacher") {
      metadata.designation = designation;
      metadata.joining_year = joiningYear;
    }
  } else {
    metadata.university_name = universityName;
    metadata.level = level;
    if (level === "+2") {
      metadata.stream = stream;
      metadata.batch = `${entryYear}-${parseInt(entryYear || "0") + 2}`;
      metadata.department = null;
      metadata.hostel = null;
    } else {
      metadata.department = department;
      metadata.batch = `${entryYear}-${exitYear}`;
      metadata.hostel = null;
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signInAction(data: LoginFormValues): Promise<AuthResponse> {
  const parsed = LoginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPasswordRequestAction(data: ForgotPasswordFormValues): Promise<AuthResponse> {
  const parsed = ForgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid email" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePasswordAction(data: ResetPasswordFormValues): Promise<AuthResponse> {
  const parsed = ResetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid password data" };
  }

  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("[updatePasswordAction] Current auth session:", session ? `Session exists (user id: ${session.user.id})` : "Session is null");

  if (!session) {
    return { error: "Auth session missing or expired. Please click the reset password link from your email again." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}