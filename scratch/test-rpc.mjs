import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLatestRPC() {
  console.log("=== Testing Latest RPC ===");
  const { data, error } = await supabase.rpc('get_latest_category_winners', {
    p_category_id: '00000000-0000-0000-0000-000000000000'
  });
  if (error) console.error("Error (Latest RPC - Unknown ID):", error);
  else console.log("Success (Latest RPC - Unknown ID): returned", data.length, "rows");

  // Get a valid category id
  const { data: cat } = await supabase.from('competition_categories').select('id, is_active').limit(1);
  if (cat && cat.length > 0) {
    const { data: latest, error: errLatest } = await supabase.rpc('get_latest_category_winners', {
      p_category_id: cat[0].id
    });
    if (errLatest) console.error("Error (Latest RPC - Valid ID):", errLatest);
    else console.log("Success (Latest RPC - Valid ID): returned", latest.length, "rows");
  }
}

async function testArchiveRPC() {
  console.log("\n=== Testing Archive RPC ===");
  const { data, error } = await supabase.rpc('get_category_winners_archive', {
    p_category_id: '00000000-0000-0000-0000-000000000000',
    p_year: 2024,
    p_month: 5
  });
  if (error) console.error("Error (Archive RPC - Unknown ID):", error);
  else console.log("Success (Archive RPC - Unknown ID): returned", data.length, "rows");

  // Get a valid category id
  const { data: cat } = await supabase.from('competition_categories').select('id').limit(1);
  if (cat && cat.length > 0) {
    const { data: arch, error: errArch } = await supabase.rpc('get_category_winners_archive', {
      p_category_id: cat[0].id,
      p_year: 2024,
      p_month: 6,
      p_level: 'department',
      p_limit: 10,
      p_offset: 0
    });
    if (errArch) console.error("Error (Archive RPC - Valid Filter):", errArch);
    else console.log("Success (Archive RPC - Valid Filter): returned", arch.length, "rows");

    const { data: archInvalidLevel, error: errArchInvalid } = await supabase.rpc('get_category_winners_archive', {
      p_category_id: cat[0].id,
      p_year: 2024,
      p_month: 6,
      p_level: 'invalid_level',
      p_limit: 10,
      p_offset: 0
    });
    if (errArchInvalid) console.error("Error (Archive RPC - Invalid Level):", errArchInvalid.message);
    else console.log("Success (Archive RPC - Invalid Level): returned", archInvalidLevel.length, "rows");
  }
}

async function run() {
  await testLatestRPC();
  await testArchiveRPC();
}

run();
