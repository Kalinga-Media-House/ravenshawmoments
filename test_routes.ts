import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

async function testRoute(route) {
  try {
    const res = await fetch(`http://localhost:3000${route}`);
    return { route, status: res.status, ok: res.ok };
  } catch (err) {
    return { route, status: 0, error: err.message };
  }
}

async function run() {
  console.log("Fetching slugs from DB...");
  const results = [];

  // Departments
  const { data: depts } = await supabase.from('departments').select('slug');
  const deptSlugs = depts?.map(d => d.slug) || [];
  console.log(`Found ${deptSlugs.length} live departments.`);
  for (const slug of deptSlugs) {
    results.push(await testRoute(`/departments/${slug}`));
  }

  // Hostels
  const { data: hostels } = await supabase.from('hostels').select('slug');
  const hostelSlugs = hostels?.map(d => d.slug) || [];
  console.log(`Found ${hostelSlugs.length} live hostels.`);
  for (const slug of hostelSlugs) {
    results.push(await testRoute(`/hostels/${slug}`));
  }

  // Organizations
  const { data: orgs } = await supabase.from('organizations').select('slug');
  const orgSlugs = orgs?.map(d => d.slug) || [];
  console.log(`Found ${orgSlugs.length} live organizations.`);
  for (const slug of orgSlugs) {
    results.push(await testRoute(`/organizations/${slug}`));
  }

  // Competitions
  const { data: comps } = await supabase.from('competitions').select('slug');
  const compSlugs = comps?.map(d => d.slug) || [];
  console.log(`Found ${compSlugs.length} live competitions.`);
  for (const slug of compSlugs) {
    results.push(await testRoute(`/competitions/${slug}`));
  }
  
  // Static Routes
  const staticRoutes = [
    '/', '/about', '/contact', '/departments', '/hostels', '/organizations', 
    '/competitions', '/gallery', '/events', '/news', '/alumni', '/login', '/register'
  ];
  for (const route of staticRoutes) {
    results.push(await testRoute(route));
  }

  const broken = results.filter(r => !r.ok);
  console.log("\nBROKEN ROUTES:");
  console.table(broken);

  if (results.length > 0) {
    console.log(`\nOverall Health: ${Math.round(((results.length - broken.length) / results.length) * 100)}%`);
  } else {
    console.log("\nOverall Health: 0% (No routes tested)");
  }
}

run().catch(console.error);
