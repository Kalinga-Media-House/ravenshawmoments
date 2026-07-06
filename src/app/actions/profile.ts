"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const full_name = String(formData.get("full_name"));
  const username = String(formData.get("username"));
  const bio = String(formData.get("bio"));

  const slug = username
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        auth_user_id: user.id,
        email: user.email,
        full_name,
        username,
        slug,
        bio,
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