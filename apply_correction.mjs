import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDataCorrection() {
  // 1. Safety Verification
  const { data: beforeData, error: beforeError } = await supabase.from('hostels').select('*');
  if (beforeError) {
    console.error('Error fetching before data:', beforeError);
    return;
  }
  
  console.log('--- BEFORE UPDATE ---');
  console.log('Total records:', beforeData.length);
  const activeCount = beforeData.filter(h => h.is_active).length;
  const verifiedCount = beforeData.filter(h => h.is_verified).length;
  console.log('Active:', activeCount);
  console.log('Verified:', verifiedCount);
  
  if (beforeData.length !== 13 || activeCount !== 13 || verifiedCount !== 0) {
    console.log('Safety check failed. Expected 13 total, 13 active, 0 verified.');
    return;
  }
  
  const names = [
      'EAST HOSTEL', 'WEST HOSTEL', 'JC HOSTEL', 'NEW HOSTEL', 
      'NEW PG HOSTEL', 'DHARMAPADA HOSTEL', 'LALITGIRI HOSTEL',
      'Parija', 'Kathajodi', 'Bhargabi', 'Devi', 'Daya', 'Mahanadi'
  ];
  
  const existingNames = beforeData.map(h => h.name);
  let allMatch = true;
  for (const n of names) {
    if (!existingNames.includes(n)) {
      console.log('Missing name:', n);
      allMatch = false;
    }
  }
  if (!allMatch) {
    console.log('Safety check failed. Not all expected names match.');
    return;
  }

  // 2. Apply Correction
  const { error: updateError } = await supabase
    .from('hostels')
    .update({ is_verified: true })
    .in('name', names);
    
  if (updateError) {
    console.error('Error during update:', updateError);
    return;
  }
  
  // 3. Verify Database Result
  const { data: afterData, error: afterError } = await supabase.from('hostels').select('*');
  if (afterError) {
    console.error('Error fetching after data:', afterError);
    return;
  }

  console.log('--- AFTER UPDATE ---');
  console.log('Total records:', afterData.length);
  console.log('Active:', afterData.filter(h => h.is_active).length);
  console.log('Verified:', afterData.filter(h => h.is_verified).length);
  console.log('Active & Verified:', afterData.filter(h => h.is_active && h.is_verified).length);
  console.log('Unverified:', afterData.filter(h => !h.is_verified).length);
}

runDataCorrection();
