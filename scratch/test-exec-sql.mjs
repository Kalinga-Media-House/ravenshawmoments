import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function checkRpc() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/) || envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  // Test calling exec_sql or see error
  const { data, error } = await supabase.rpc("exec_sql", { sql: "SELECT 1" });
  console.log("exec_sql RPC result:", { data, error });
}

checkRpc();
