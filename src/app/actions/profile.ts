"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { profileSchema } from "@/lib/validation";
import { sanitizeText } from "@/lib/sanitize";

export async function createProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawInput = {
    full_name: sanitizeText(String(formData.get("full_name") || "")),
    username: sanitizeText(String(formData.get("username") || "")),
    bio: sanitizeText(String(formData.get("bio") || "")),
  };

  const validated = profileSchema.parse(rawInput);

  const slug = (validated.username || user.id)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        auth_user_id: user.id,
        email: user.email,
        full_name: validated.full_name,
        username: validated.username,
        slug,
        bio: validated.bio,
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}