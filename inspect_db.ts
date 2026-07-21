import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  const { data: departments } = await supabase.from('departments').select('id, slug, name');
  console.log('Departments:');
  console.log(departments);

  const { data: levels } = await supabase.from('course_levels').select('*');
  console.log('Course Levels:');
  console.log(levels);
  
  const { data: profiles } = await supabase.from('profiles').select('level, profile_type, stream, batch_year').limit(10);
  console.log('Profiles:');
  console.log(profiles);
}

inspectDb();
