const fs = require('fs');

const filesToPatch = [
  'c:/Projects/ravenshawmoments/src/features/achievement/components/AchievementStatistics.tsx',
  'c:/Projects/ravenshawmoments/src/features/achievement/components/AchievementsEmptyState.tsx'
];

filesToPatch.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Replace gold to maroon inside these specific files for light background mapping
  content = content.replace(/var\(--color-rm-gold\)/g, 'var(--color-maroon)');
  content = content.replace(/var\(--color-rm-gold-soft\)/g, 'var(--color-maroon-dark)');

  // Remove explicit text-white where rm-heading-primary is present
  content = content.replace(/rm-heading-primary text-white/g, 'rm-heading-primary');
  content = content.replace(/rm-heading-primary tracking-tight text-white/g, 'rm-heading-primary tracking-tight');
  
  // Replace white text variations
  content = content.replace(/text-white\/40/g, 'text-black/40');
  content = content.replace(/text-white\/60/g, 'text-black/60');
  content = content.replace(/text-white\/70/g, 'text-muted-foreground');
  content = content.replace(/text-white\/80/g, 'text-black/80');
  
  // Replace borders
  content = content.replace(/border-white\/10/g, 'border-black/10');
  content = content.replace(/border-white\/20/g, 'border-black/20');
  
  // Replace backgrounds
  content = content.replace(/bg-white\/5 /g, 'bg-black/5 ');
  content = content.replace(/bg-white\/5\"/g, 'bg-black/5"');
  content = content.replace(/bg-white\/10/g, 'bg-black/10');
  
  // Specific button in EmptyState
  content = content.replace(/bg-\[var\(--color-rm-accent\)\]\/10 hover:bg-\[var\(--color-rm-accent\)\]\/20 text-white border border-\[var\(--color-rm-accent\)\]\/30/g, 'bg-black/5 hover:bg-black/10 text-foreground border border-border');

  fs.writeFileSync(file, content);
  console.log(`Patched ${file}`);
});
