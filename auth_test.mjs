import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { execSync } from "child_process";

async function run() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  if (!urlMatch || !keyMatch) {
    console.error("Missing env");
    return;
  }

  const supabaseUrl = urlMatch[1].trim();
  const supabaseKey = keyMatch[1].trim();

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Create a test user directly or login if known
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test@example.com", // Need a valid login or just fetch dev server logs
    password: "password123"
  });

  if (error) {
    console.error("Login failed:", error.message);
    // Let's just create a user to test
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: "test_dashboard_err@example.com",
      password: "Password123!"
    });
    if (signUpError) {
       console.error("SignUp failed:", signUpError.message);
       return;
    }
    console.log("Signed up user", signUpData.user?.id);
    
    // We need to fetch the dashboard with their cookie!
  }
}

run();
