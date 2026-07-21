import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  const { data: facultyProfiles, error: e1 } = await supabase.from('profiles').select('id, level, profile_type, full_name, stream').eq('profile_type', 'teacher').limit(10);
  console.log('Teacher Profiles:', facultyProfiles, e1);

  const { data: deptPrograms, error: e2 } = await supabase.from('department_programs').select('*, course_levels!inner(code), departments(slug, name)').eq('course_levels.code', 'plus_two');
  console.log('+2 Programs:', deptPrograms, e2);
  
  const { data: galleries, error: e3 } = await supabase.from('gallery_albums').select('id, title, department_id, entity_type').limit(10);
  console.log('Galleries:', galleries, e3);
  
  const { data: achievements, error: e4 } = await supabase.from('achievements').select('id, title, department_id').limit(10);
  console.log('Achievements:', achievements, e4);
}

inspectDb();
