const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const envPath = path.join(projectRoot, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) envVars[m[1].trim()] = m[2].trim();
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  const testEmail = `ext.test.${Date.now()}@example.com`;
  console.log(`=== LIVE REGISTRATION TEST ===`);
  console.log(`1. Creating test auth user with email: ${testEmail} and role: 'external_participant'`);
  
  const metadata = {
    full_name: 'Live Test External Participant',
    role: 'external_participant',
    is_ravenshawvian: false,
    university_name: 'External Test Institute',
    level: 'UG',
    department: 'Computer Science',
    batch: '2022-2026'
  };

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'TestPassword1234!',
    options: {
      data: metadata
    }
  });

  if (authError) {
    console.error(`Auth signUp failed:`, authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log(`Auth user created ID: ${userId}`);

  // Wait 1 second just in case trigger needs a tick
  await new Promise(r => setTimeout(r, 1000));

  console.log(`2. Querying profiles table for auth_user_id = ${userId}...`);
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', userId);

  if (profileError) {
    console.error(`Profiles query failed:`, profileError.message);
    process.exit(1);
  }

  console.log(`Profiles rows created: ${profiles.length}`);
  if (profiles.length === 0) {
    console.error(`❌ No profile created by handle_new_user()!`);
  } else if (profiles.length > 1) {
    console.error(`❌ Duplicate profiles created: ${profiles.length}`);
  } else {
    const profile = profiles[0];
    console.log(`Profile ID: ${profile.id}`);
    console.log(`Profile Name: ${profile.full_name}`);
    console.log(`Profile Slug: ${profile.slug}`);
    console.log(`Profile Type: ${profile.profile_type}`);
    
    if (profile.profile_type === 'external_participant') {
      console.log(`✅ SUCCESS! Deployed handle_new_user() trigger correctly assigned profile_type = 'external_participant'!`);
    } else {
      console.error(`❌ FAILURE! Expected profile_type = 'external_participant', got '${profile.profile_type}'!`);
    }
  }

  console.log(`3. Testing query for External Participants tab...`);
  const { data: extList, count } = await supabase
    .from('profiles')
    .select('id, full_name, email, profile_type', { count: 'exact' })
    .eq('profile_type', 'external_participant')
    .is('deleted_at', null);

  console.log(`Found ${count} external participants total in database.`);
  extList.forEach(p => console.log(`   - [${p.profile_type}] ${p.full_name} (${p.email}) - ID: ${p.id}`));

  console.log(`4. Cleaning up test auth user (${userId})...`);
  const { error: delError } = await supabase.auth.admin.deleteUser(userId);
  if (delError) {
    console.error(`Cleanup failed:`, delError.message);
  } else {
    console.log(`Test user cleaned up cleanly ✅`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
