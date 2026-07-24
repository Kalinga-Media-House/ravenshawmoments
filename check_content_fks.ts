import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

async function run() {
  const tables = ['content_items', 'content_comments'];
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*, profiles(*)').limit(1);
    console.log(`[${table}] ERROR: ${error?.message || 'OK'}`);
  }
}

run().catch(console.error);
