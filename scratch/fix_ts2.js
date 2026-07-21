const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/repositories/organization/organizationMember.repository.ts', [
  ['profiles\\(full_name, avatar_url\\)', 'profiles(full_name, email)']
]);

replaceInFile('src/repositories/organization/organizationRecruitment.repository.ts', [
  ['profiles\\(full_name, avatar_url\\)', 'profiles(full_name, email)']
]);

replaceInFile('src/repositories/organization/organizationAttendance.repository.ts', [
  ['profiles\\(full_name, avatar_url\\)', 'profiles(full_name, email)']
]);

replaceInFile('src/app/(dashboard)/dashboard/profile/organizations/page.tsx', [
  ['@/utils/supabase/server', '@/lib/supabase/server']
]);

replaceInFile('src/app/(main)/organizations/[slug]/page.tsx', [
  ['member\\.profiles\\?\\.avatar_url', 'null'],
  ['src=\\{member\\.profiles\\.avatar_url\\}', 'src=""']
]);

console.log("Fixes applied round 2.");
