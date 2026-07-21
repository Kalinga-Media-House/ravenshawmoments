// Apply migration 050 and verify the deployed trigger
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
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

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('=== Step 1: Read migration 050 SQL ===');
  const sqlPath = path.join(projectRoot, 'supabase', 'migrations', '050_fix_external_participant_trigger.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  console.log('Migration SQL loaded:', sql.length, 'bytes');

  console.log('\n=== Step 2: Apply migration 050 via rpc/sql ===');
  // Use the rpc endpoint to execute raw SQL
  const { data: applyResult, error: applyError } = await supabase.rpc('exec_sql', { sql_text: sql });
  
  if (applyError) {
    console.log('rpc exec_sql not available, trying direct query approach...');
    // Fallback: execute individual statements
    // Strip BEGIN/COMMIT for direct execution
    const cleanSql = sql
      .replace(/^BEGIN;\s*/m, '')
      .replace(/\s*COMMIT;\s*$/m, '');
    
    // Try using the REST API with a custom query
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ query: cleanSql })
    });
    
    if (!response.ok) {
      console.log('Direct REST also unavailable. Will use Supabase SQL Editor approach.');
      console.log('');
      console.log('=== MANUAL APPLICATION REQUIRED ===');
      console.log('The migration must be applied via Supabase Dashboard SQL Editor.');
      console.log('Project URL: (redacted)/project/yahllwlimhztjyjkfwwe/sql/new');
      console.log('');
      console.log('Copy the SQL from: supabase/migrations/050_fix_external_participant_trigger.sql');
      console.log('Paste it into the SQL Editor and click "Run".');
      console.log('');
    }
  } else {
    console.log('Migration applied successfully via rpc.');
  }

  console.log('\n=== Step 3: Verify deployed trigger function ===');
  // Query pg_proc to check the function definition
  const { data: funcDef, error: funcErr } = await supabase
    .from('pg_catalog.pg_proc')
    .select('prosrc')
    .eq('proname', 'handle_new_user')
    .single();

  if (funcErr) {
    console.log('Cannot query pg_catalog directly (expected with RLS).');
    console.log('Will verify by checking existing profile mappings instead.');
  } else {
    console.log('Function source contains external_participant:', 
      funcDef?.prosrc?.includes('external_participant') ? 'YES ✅' : 'NO ❌');
  }

  console.log('\n=== Step 4: Check for misclassified profiles ===');
  // Find profiles where auth metadata says external but profile_type is student
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, profile_type, university_name, auth_user_id')
    .is('deleted_at', null);

  console.log('Total profiles:', allProfiles?.length || 0);

  // Check each profile's auth metadata for misclassification
  const misclassified = [];
  if (allProfiles) {
    for (const profile of allProfiles) {
      if (profile.profile_type === 'student' && profile.university_name) {
        // This profile has university_name set but is classified as student
        // Check auth metadata for definitive evidence
        if (profile.auth_user_id) {
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.auth_user_id);
          if (user?.user_metadata?.role === 'external_participant' || 
              user?.user_metadata?.role === 'external' ||
              user?.user_metadata?.is_ravenshawvian === false) {
            misclassified.push({
              id: profile.id,
              full_name: profile.full_name,
              email: profile.email,
              profile_type: profile.profile_type,
              university_name: profile.university_name,
              auth_role: user.user_metadata?.role,
              is_ravenshawvian: user.user_metadata?.is_ravenshawvian,
            });
          }
        }
      }
      
      // Also check profiles that are external_participant type (verify they exist correctly)
      if (profile.profile_type === 'external_participant') {
        console.log('Found existing external_participant:', profile.full_name, profile.email);
      }
    }
  }

  if (misclassified.length > 0) {
    console.log('\n=== MISCLASSIFIED PROFILES FOUND ===');
    for (const p of misclassified) {
      console.log(`  Profile: ${p.full_name} (${p.email})`);
      console.log(`    ID: ${p.id}`);
      console.log(`    Current profile_type: ${p.profile_type}`);
      console.log(`    Auth metadata role: ${p.auth_role}`);
      console.log(`    is_ravenshawvian: ${p.is_ravenshawvian}`);
      console.log(`    university_name: ${p.university_name}`);
      console.log(`    Deterministic evidence: auth role="${p.auth_role}", is_ravenshawvian=${p.is_ravenshawvian}`);
    }

    // Fix deterministically identifiable misclassified profiles
    console.log('\n=== Step 5: Fix misclassified profiles ===');
    for (const p of misclassified) {
      if (p.auth_role === 'external_participant' || p.auth_role === 'external' || p.is_ravenshawvian === false) {
        console.log(`Fixing: ${p.full_name} (${p.id}) from '${p.profile_type}' to 'external_participant'`);
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ profile_type: 'external_participant' })
          .eq('id', p.id);
        
        if (updateErr) {
          console.log(`  ERROR: ${updateErr.message}`);
        } else {
          console.log('  Fixed ✅');
        }
      }
    }
  } else {
    console.log('No misclassified profiles found.');
  }

  console.log('\n=== Step 6: Verify External Participants in database ===');
  const { data: extProfiles, count: extCount } = await supabase
    .from('profiles')
    .select('id, full_name, email, profile_type, university_name, created_at', { count: 'exact' })
    .eq('profile_type', 'external_participant')
    .is('deleted_at', null);
  
  console.log('External participant count:', extCount || 0);
  if (extProfiles && extProfiles.length > 0) {
    extProfiles.forEach(p => {
      console.log(`  - ${p.full_name} | ${p.email} | university: ${p.university_name || 'N/A'} | created: ${p.created_at}`);
    });
  }

  console.log('\n=== Step 7: Verify all auth users metadata ===');
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 50 });
  console.log('Total auth users:', users?.length || 0);
  
  const externalUsers = users?.filter(u => 
    u.user_metadata?.role === 'external_participant' || 
    u.user_metadata?.role === 'external' ||
    u.user_metadata?.is_ravenshawvian === false
  );
  
  if (externalUsers && externalUsers.length > 0) {
    console.log('Auth users with external/non-Ravenshaw metadata:');
    for (const u of externalUsers) {
      console.log(`  - ${u.email} | role: ${u.user_metadata?.role} | is_ravenshawvian: ${u.user_metadata?.is_ravenshawvian}`);
      
      // Check corresponding profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, profile_type, full_name')
        .eq('auth_user_id', u.id)
        .single();
      
      if (profile) {
        console.log(`    Profile: ${profile.full_name} | type: ${profile.profile_type} | ${profile.profile_type === 'external_participant' ? '✅' : '❌ WRONG'}`);
      } else {
        console.log('    No profile found!');
      }
    }
  } else {
    console.log('No auth users with external/non-Ravenshaw metadata found.');
  }

  console.log('\n=== DONE ===');
}

run().catch(err => {
  console.error('Script error:', err.message);
  process.exit(1);
});
