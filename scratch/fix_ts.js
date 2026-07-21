const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Fix repositories
replaceInFile('src/repositories/organization/organizationMember.repository.ts', [
  ['profiles\\(first_name, last_name, avatar_url, roll_number, email\\)', 'profiles(full_name, avatar_url)']
]);

replaceInFile('src/repositories/organization/organizationRecruitment.repository.ts', [
  ['profiles\\(first_name, last_name, avatar_url, roll_number, email\\)', 'profiles(full_name, avatar_url)']
]);

replaceInFile('src/repositories/organization/organizationAttendance.repository.ts', [
  ['profiles\\(first_name, last_name, avatar_url, roll_number\\)', 'profiles(full_name, avatar_url)']
]);

// 2. Fix actions imports
const actionsDir = 'src/app/actions/organization';
for (const file of fs.readdirSync(actionsDir)) {
  replaceInFile(path.join(actionsDir, file), [
    ['@/utils/supabase/server', '@/lib/supabase/server']
  ]);
}

// 3. Fix organization.repository.ts type filter
replaceInFile('src/repositories/organization/organization.repository.ts', [
  ['if \\(filters\\?\\.type\\) query = query\\.eq\\(\'type\', filters\\.type\\);', ''],
  ['filters\\?: \\{ type\\?: string, isActive\\?: boolean, isVerified\\?: boolean \\}', 'filters?: { isActive?: boolean, isVerified?: boolean }']
]);

// 4. Fix organizations/page.tsx
replaceInFile('src/app/(main)/organizations/page.tsx', [
  ['<span className="inline-flex items-center px-2\\.5 py-0\\.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase">\n                      \\{org\\.type\\}\n                    </span>', '']
]);

// 5. Fix organizations/[slug]/page.tsx
replaceInFile('src/app/(main)/organizations/[slug]/page.tsx', [
  ['member\\.profiles\\?\\.first_name\\?\\.\\[0\\]\\}\\{member\\.profiles\\?\\.last_name\\?\\.\\[0\\]', 'member.profiles?.full_name?.[0]'],
  ['member\\.profiles\\?\\.first_name\\} \\{member\\.profiles\\?\\.last_name\\}', 'member.profiles?.full_name']
]);

console.log("Fixes applied.");
