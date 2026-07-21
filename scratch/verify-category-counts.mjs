import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const FRONTEND_CATEGORIES = [
  "Graphic Design",
  "Video Editing",
  "Photography",
  "Videography",
  "Short Story — Odia",
  "Poetry — Odia",
  "Essay Writing",
  "Debate",
  "Quiz",
  "Painting",
  "Music",
  "Dance"
];

async function compareCategories() {
  const envFile = fs.readFileSync("c:/Projects/ravenshawmoments/.env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/) || envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  const { data: dbCategories, error } = await supabase
    .from("competition_categories")
    .select("name")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const dbNames = dbCategories.map(c => c.name);
  const dbSet = new Set(dbNames);
  const feSet = new Set(FRONTEND_CATEGORIES);

  const matches = FRONTEND_CATEGORIES.filter(name => dbSet.has(name));
  const missingFromFE = dbNames.filter(name => !feSet.has(name));
  const missingFromDB = FRONTEND_CATEGORIES.filter(name => !dbSet.has(name));

  console.log(`Database Category Count: ${dbNames.length}`);
  console.log(`Frontend Configuration Count: ${FRONTEND_CATEGORIES.length}`);
  console.log(`Exact Matches: ${matches.length}`);
  console.log(`Database Categories Missing from Frontend Configuration: ${missingFromFE.length}`);
  if (missingFromFE.length > 0) {
    console.log("Sample Missing from FE (first 10):", missingFromFE.slice(0, 10));
  }
  console.log(`Frontend Categories Missing from Database: ${missingFromDB.length}`);
  if (missingFromDB.length > 0) {
    console.log("Missing from DB:", missingFromDB);
  }
}

compareCategories();
