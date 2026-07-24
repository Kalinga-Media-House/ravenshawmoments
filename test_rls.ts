import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use ANON key to simulate unauthenticated Next.js server component
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function run() {
  console.log("Fetching with ANON key to test RLS...");

  const { data: depts, error: err1 } = await supabaseAnon.from('departments').select('slug');
  console.log(`Departments visible to public: ${depts?.length || 0}`, err1?.message || '');

  const { data: orgs, error: err2 } = await supabaseAnon.from('organizations').select('slug');
  console.log(`Organizations visible to public: ${orgs?.length || 0}`, err2?.message || '');

  const { data: hostels, error: err3 } = await supabaseAnon.from('hostels').select('slug');
  console.log(`Hostels visible to public: ${hostels?.length || 0}`, err3?.message || '');
}

run().catch(console.error);
