import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAction() {
  const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'banamalikanhar7@gmail.com',
    password: 'password123', // I don't know the password actually.
  });
  console.log('Auth:', authError || 'Success');

  const { data, error } = await supabase.from('hostels').select('id, name').eq('is_active', true);
  console.log('Hostels:', data, error);
}

testAction();
