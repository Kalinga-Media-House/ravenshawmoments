import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  const { data: facultyProfiles } = await supabase.from('profiles').select('level, profile_type, full_name, stream').eq('profile_type', 'faculty').limit(10);
  console.log('Faculty Profiles:');
  console.log(facultyProfiles);

  const { data: departmentTeachers } = await supabase.from('department_teachers').select('*, profiles(level, stream, full_name)').limit(10);
  console.log('Department Teachers:');
  console.log(departmentTeachers);
  
  const { data: programs } = await supabase.from('department_programs').select('*, departments(slug, name)').eq('level', 'plus_two');
  console.log('+2 Programs:');
  console.log(programs);
}

inspectDb();
