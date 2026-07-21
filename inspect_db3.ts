import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  const { data: facultyProfiles, error: e1 } = await supabase.from('profiles').select('id, level, profile_type, full_name, stream').eq('profile_type', 'faculty').limit(10);
  console.log('Faculty Profiles:', facultyProfiles, e1);

  const { data: departmentTeachers, error: e2 } = await supabase.from('department_teachers').select('*, profiles(level, stream, full_name)').limit(10);
  console.log('Department Teachers:', departmentTeachers, e2);
  
  const { data: programs, error: e3 } = await supabase.from('department_programs').select('*, departments(slug, name)').eq('level', 'plus_two');
  console.log('+2 Programs:', programs, e3);
  
  const { data: std, error: e4 } = await supabase.from('profiles').select('level, profile_type, stream, batch_year').eq('profile_type', 'student').limit(10);
  console.log('Students:', std, e4);
}

inspectDb();
