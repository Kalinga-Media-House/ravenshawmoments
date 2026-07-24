const fs = require('fs');
const files = [
  'src/features/organization/services/index.ts',
  'src/features/placement/actions/placement.actions.ts',
  'src/features/profile/services/profile-gallery.service.ts',
  'src/lib/auth.ts',
  'src/lib/authorization.ts',
  'src/lib/authorization/profile-review.ts',
  'src/lib/permissions.ts',
  'src/services/directory.service.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Regex matching supabase followed by optional newlines/spaces, then .from or .rpc
    content = content.replace(/supabase(\s*)\.from\(/g, '(supabase as any)$1.from(');
    content = content.replace(/supabase(\s*)\.rpc\(/g, '(supabase as any)$1.rpc(');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
