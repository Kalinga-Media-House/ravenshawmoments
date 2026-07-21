import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function verifyStageA() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/) || envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  console.log("=== 1. Checking Point Rules ===");
  const { data: rules, error: rulesErr } = await supabase
    .from("competition_point_rules")
    .select("*")
    .order("points", { ascending: false });

  if (rulesErr) {
    console.error("Error querying competition_point_rules:", rulesErr);
  } else {
    console.log("Point Rules:", rules);
  }

  console.log("=== 2. Testing RPC: get_competition_leaderboard ===");
  const { data: leaderboard, error: lbErr } = await supabase.rpc("get_competition_leaderboard", {
    p_limit: 5,
    p_offset: 0
  });
  if (lbErr) {
    console.error("Error calling get_competition_leaderboard:", lbErr);
  } else {
    console.log(`Leaderboard returned ${leaderboard?.length || 0} rows successfully.`);
  }

  console.log("=== 3. Testing RPC: get_competition_winners_gallery ===");
  const { data: gallery, error: galleryErr } = await supabase.rpc("get_competition_winners_gallery", {
    p_limit: 5,
    p_offset: 0
  });
  if (galleryErr) {
    console.error("Error calling get_competition_winners_gallery:", galleryErr);
  } else {
    console.log(`Winners Gallery returned ${gallery?.length || 0} rows successfully.`);
  }
}

verifyStageA();
