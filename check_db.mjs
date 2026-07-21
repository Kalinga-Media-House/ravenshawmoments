import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHostels() {
  const { data, error } = await supabase.from('hostels').select('*');
  console.log('Hostels Query Result:');
  console.log('Error:', error);
  console.log('Data count:', data?.length);
  if (data) {
    for (const h of data) {
      console.log(`- ${h.name} (active: ${h.is_active})`);
    }
  }
}

checkHostels();
