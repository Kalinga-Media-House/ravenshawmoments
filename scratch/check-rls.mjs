import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function checkRLS() {
  console.log("Supabase URL:", supabaseUrl);
  // We can just try to fetch a public legal document as anon
  const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  const { data: anonDocs, error: anonErr } = await anonSupabase.from('legal_documents').select('*');
  console.log("Anon Legal Docs:", anonDocs?.length, anonErr);

  const { data: anonConsents, error: anonConsErr } = await anonSupabase.from('registration_consents').select('*');
  console.log("Anon Consents:", anonConsents?.length, anonConsErr);
}

checkRLS();
