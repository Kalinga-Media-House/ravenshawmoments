import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function run() {
  console.log("Fetching related tables with ANON key...");
  const queries = [
    'department_teachers',
    'department_students',
    'department_crs',
    'department_notices',
    'department_events',
    'department_publications',
    'student_profiles' // sometimes joined
  ];

  for (const table of queries) {
    const { data, error } = await supabaseAnon.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error on ${table}:`, error.message);
    } else {
      console.log(`Success on ${table}. Rows: ${data?.length}`);
    }
  }
}

run().catch(console.error);
