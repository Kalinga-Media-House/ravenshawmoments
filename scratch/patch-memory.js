const fs = require('fs');
const path = require('path');

const memoryDir = 'c:/Projects/ravenshawmoments/src/features/memory/components';
const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.tsx')).map(f => path.join(memoryDir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace bg-[var(--color-rm-bg-deep)] explicitly used in MemoriesDirectory etc
  content = content.replace(/bg-\[var\(--color-rm-bg-deep\)\] text-white/g, 'bg-background text-foreground');
  content = content.replace(/bg-\[var\(--color-rm-bg-deep\)\]/g, 'bg-background');

  // Replace gold to maroon inside these specific files for light background mapping
  // Be careful with image overlays. We will only replace text-[var(--color-rm-gold)] -> text-[var(--color-maroon)]
  content = content.replace(/text-\[var\(--color-rm-gold\)\]/g, 'text-[var(--color-maroon)]');
  content = content.replace(/hover:text-\[var\(--color-rm-gold\)\]/g, 'hover:text-[var(--color-maroon)]');
  content = content.replace(/focus-visible:ring-\[var\(--color-rm-gold\)\]/g, 'focus-visible:ring-[var(--color-maroon)]');

  // Remove explicit text-white where rm-heading-primary is present
  content = content.replace(/rm-heading-primary text-white/g, 'rm-heading-primary');
  content = content.replace(/rm-heading-primary tracking-tight text-white/g, 'rm-heading-primary tracking-tight');
  
  // Replace white text variations in body text context
  content = content.replace(/text-white\/40/g, 'text-black/40');
  content = content.replace(/text-white\/60/g, 'text-black/60');
  content = content.replace(/text-white\/70/g, 'text-muted-foreground');
  content = content.replace(/text-white\/80/g, 'text-black/80');
  content = content.replace(/text-white\/75/g, 'text-black/75');
  content = content.replace(/text-white\/85/g, 'text-black/85');
  content = content.replace(/text-white\/65/g, 'text-black/65');
  
  // For border
  content = content.replace(/border-white\/10/g, 'border-black/10');
  content = content.replace(/border-white\/20/g, 'border-black/20');
  
  // For background
  content = content.replace(/bg-white\/5 /g, 'bg-black/5 ');
  content = content.replace(/bg-white\/5\"/g, 'bg-black/5"');
  content = content.replace(/bg-white\/10/g, 'bg-black/10');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Patched ${path.basename(file)}`);
  }
});
