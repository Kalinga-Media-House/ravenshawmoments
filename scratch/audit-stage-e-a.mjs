import { createClient } from "@supabase/supabase-js";
import fs from "fs";

async function auditStageEA() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/) || envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  console.log("=== 1. Live Category Counts & Data ===");
  const { data: categories, error } = await supabase
    .from("competition_categories")
    .select("*");

  if (error) {
    console.error("Error querying competition_categories:", error);
    return;
  }

  const total = categories.length;
  const active = categories.filter(c => c.is_active).length;
  const inactive = categories.filter(c => !c.is_active).length;

  console.log(`Total Categories: ${total}`);
  console.log(`Active Categories: ${active}`);
  console.log(`Inactive Categories: ${inactive}`);

  if (categories.length > 0) {
    console.log("Existing columns:", Object.keys(categories[0]));
  }

  // Check existing slug fields if any
  const existingSlugs = categories.filter(c => c.slug !== undefined && c.slug !== null);
  const nullSlugs = categories.filter(c => c.slug === undefined || c.slug === null);
  console.log(`Existing Non-Null Slugs: ${existingSlugs.length}`);
  console.log(`Existing Null Slugs: ${nullSlugs.length}`);

  // Collision Analysis
  const slugMap = new Map();
  const collisions = [];
  const emptySlugs = [];

  for (const cat of categories) {
    const rawName = cat.name || "";
    const normalized = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!normalized) {
      emptySlugs.push(cat.name);
    } else if (slugMap.has(normalized)) {
      collisions.push({
        slug: normalized,
        existing: slugMap.get(normalized),
        duplicate: cat.name
      });
    } else {
      slugMap.set(normalized, cat.name);
    }
  }

  console.log(`Number of normalized slug collisions: ${collisions.length}`);
  if (collisions.length > 0) {
    console.log("Collisions:", collisions);
  }
  console.log(`Number of empty normalized slugs: ${emptySlugs.length}`);
}

auditStageEA();
