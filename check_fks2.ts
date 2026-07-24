import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

async function run() {
  const { data, error } = await supabase.from('department_students').select('*, profiles!profile_id(*)').limit(1);
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS!');
  }
}

run().catch(console.error);
