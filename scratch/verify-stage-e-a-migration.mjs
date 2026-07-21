import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function verifyStageEAMigration() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/) || envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  console.log("=== VERIFYING POST-MIGRATION STATE ===");

  const { data: categories, error } = await supabase
    .from("competition_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return;
  }

  const total = categories.length;
  console.log(`Total Category Count: ${total}`);

  const nonNullSlugs = categories.filter(c => c.slug !== null && c.slug !== undefined);
  console.log(`Non-Null Slug Count: ${nonNullSlugs.length}`);

  const emptySlugs = categories.filter(c => !c.slug || c.slug.trim() === "");
  console.log(`Empty Slug Count: ${emptySlugs.length}`);

  const canonicalRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const invalidFormatSlugs = categories.filter(c => !canonicalRegex.test(c.slug || ""));
  console.log(`Invalid Canonical Slug Count: ${invalidFormatSlugs.length}`);

  const slugSet = new Set(categories.map(c => c.slug));
  console.log(`Distinct Slug Count: ${slugSet.size}`);
  console.log(`Duplicate Slug-Group Count: ${total - slugSet.size}`);

  const nonNullDisplayOrders = categories.filter(c => c.display_order !== null && c.display_order !== undefined);
  console.log(`Non-Null Display Order Count: ${nonNullDisplayOrders.length}`);

  const orderSet = new Set(categories.map(c => c.display_order));
  console.log(`Distinct Display Order Count: ${orderSet.size}`);

  const curatedNames = [
    "Graphic Design", "Video Editing", "Photography", "Videography",
    "Short Story — Odia", "Poetry — Odia", "Essay Writing", "Debate",
    "Quiz", "Painting", "Music", "Dance"
  ];

  const curatedCats = categories.filter(c => curatedNames.includes(c.name));
  const remainingCats = categories.filter(c => !curatedNames.includes(c.name));

  console.log(`Curated Categories Count: ${curatedCats.length}`);
  const curatedOrders = curatedCats.map(c => `${c.name}: ${c.display_order}`);
  console.log("Curated Display Orders (first 6):", curatedOrders.slice(0, 6));

  console.log(`Remaining Categories Count: ${remainingCats.length}`);
  const remainingOrders = remainingCats.map(c => `${c.name}: ${c.display_order}`);
  console.log("Remaining Display Orders (first 6):", remainingOrders.slice(0, 6));

  // Check RLS read access
  const { data: publicCheck, error: rlsErr } = await supabase
    .from("competition_categories")
    .select("slug, name, display_order")
    .limit(3);

  console.log("RLS Public Read Policy verification:", rlsErr ? `ERROR: ${rlsErr.message}` : `SUCCESS (${publicCheck.length} rows readable)`);
}

verifyStageEAMigration();
