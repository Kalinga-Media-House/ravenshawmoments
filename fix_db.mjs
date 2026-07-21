import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixHostels() {
  const { data, error } = await supabase
    .from('hostels')
    .update({ is_verified: true })
    .in('name', [
      'EAST HOSTEL', 'WEST HOSTEL', 'JC HOSTEL', 'NEW HOSTEL', 
      'NEW PG HOSTEL', 'DHARMAPADA HOSTEL', 'LALITGIRI HOSTEL',
      'Parija', 'Kathajodi', 'Bhargabi', 'Devi', 'Daya', 'Mahanadi'
    ]);
  console.log('Update result:', data, error);
}

fixHostels();
