import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("=== Anonymous RPC Execution ===");
  
  const { data: latestAnon, error: errAnonLatest } = await anonClient.rpc('get_latest_category_winners', {
    p_category_id: '00000000-0000-0000-0000-000000000000'
  });
  console.log("Latest Anon:", latestAnon ? latestAnon.length : errAnonLatest?.message);

  const { data: archiveAnon, error: errAnonArchive } = await anonClient.rpc('get_category_winners_archive', {
    p_category_id: '00000000-0000-0000-0000-000000000000',
    p_year: 2026,
    p_month: 7,
    p_level: null,
    p_limit: 10,
    p_offset: 0
  });
  console.log("Archive Anon:", archiveAnon ? archiveAnon.length : errAnonArchive?.message);

  console.log("=== Authenticated RPC Execution ===");
  // Note: For an authenticated user, we would need a JWT or email/password.
  // We'll skip actual auth login if we don't have credentials, and just report it.
}

run().catch(console.error);
