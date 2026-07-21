import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHostels() {
  const { data: afterData, error: afterError } = await supabase.from('hostels').select('*');
  if (afterError) {
    console.error('Error fetching data:', afterError);
    return;
  }

  console.log('--- AFTER UPDATE ---');
  console.log('Total records:', afterData.length);
  console.log('Active:', afterData.filter(h => h.is_active).length);
  console.log('Verified:', afterData.filter(h => h.is_verified).length);
  console.log('Active & Verified:', afterData.filter(h => h.is_active && h.is_verified).length);
  console.log('Unverified:', afterData.filter(h => !h.is_verified).length);
}

checkHostels();
