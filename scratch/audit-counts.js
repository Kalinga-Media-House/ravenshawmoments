const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { count: total } = await supabase.from('competitions').select('*', { count: 'exact', head: true });
  console.log('Total Competitions:', total);

  const { count: feeZero } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('registration_fee', 0);
  console.log('Fee = 0:', feeZero);
  
  const { count: feeGtZero } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).gt('registration_fee', 0);
  console.log('Fee > 0:', feeGtZero);

  const { count: feeNull } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).is('registration_fee', null);
  console.log('Fee IS NULL:', feeNull);

  const { count: feeLtZero } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).lt('registration_fee', 0);
  console.log('Fee < 0:', feeLtZero);

  const { data: statuses } = await supabase.from('competitions').select('competition_status');
  const counts = statuses.reduce((acc, row) => {
    acc[row.competition_status] = (acc[row.competition_status] || 0) + 1;
    return acc;
  }, {});
  console.log('Statuses:', counts);

  const { count: isPublic } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('is_public', true);
  console.log('Public:', isPublic);

  const { count: drafts } = await supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('competition_status', 'draft');
  console.log('Drafts:', drafts);
}

run().catch(console.error);
