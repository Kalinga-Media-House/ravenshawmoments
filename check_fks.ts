import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const query = `
    SELECT
      tc.table_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name,
      tc.constraint_name
    FROM 
      information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'profiles';
  `;

  // We have to use the Postgres meta API or just run raw SQL via an RPC function.
  // Wait, Supabase client can't run raw SQL directly unless we use an RPC. 
  // Let's use the postgres client directly with 'pg' package if it's installed,
  // or we can just fetch one row from each table and see the error message! 
  // PostgREST error messages for ambiguous embedding tell you exactly what foreign keys exist!
  const tables = [
    'hostel_bmcs',
    'competition_teams',
    'competition_team_members',
    'access_logs',
    'digital_identities',
    'news',
    'department_crs',
    'department_students',
    'department_teachers',
    'department_publications',
    'department_notices',
    'organization_members',
    'organization_attendances',
    'organization_recruitment_applications'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*, profiles(*)').limit(1);
    if (error) {
      console.log(`[${table}] ERROR: ${error.message}`);
    } else {
      console.log(`[${table}] OK (No ambiguity)`);
    }
  }
}

run().catch(console.error);
