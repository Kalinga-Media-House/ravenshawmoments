const fs = require('fs');
const path = require('path');

const dir = 'C:\\Projects\\ravenshawmoments\\src\\features\\about\\components';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { from: /text-white\/([0-9]+)/g, to: 'text-[#756A6E]' },
  { from: /text-white/g, to: 'text-[#171214]' },
  { from: /bg-white\/5/g, to: 'bg-white' },
  { from: /border-white\/10/g, to: 'border-[#8F0028]/10' },
  { from: /border-white\/5/g, to: 'border-[#8F0028]/10' },
  { from: /bg-black\/20/g, to: 'bg-[#8F0028]/5' },
  { from: /bg-\[var\(--color-rm-background\)\]/g, to: 'bg-[#FFFDF8]' },
  { from: /bg-\[var\(--color-rm-maroon\)\]\/40/g, to: 'bg-[#8F0028]/10' },
  { from: /bg-\[var\(--color-rm-maroon\)\]\/60/g, to: 'bg-[#8F0028]/10' },
  { from: /bg-\[var\(--color-rm-maroon\)\]\/80/g, to: 'bg-[#8F0028]/10' },
  { from: /bg-\[var\(--color-rm-maroon\)\]\/90/g, to: 'bg-[#8F0028]/10' },
  { from: /border-\[var\(--color-rm-gold\)\]\/30/g, to: 'border-[#E8B83F]/30' },
  { from: /border-\[var\(--color-rm-gold\)\]\/40/g, to: 'border-[#E8B83F]/40' },
  { from: /text-\[var\(--color-rm-gold\)\]/g, to: 'text-[#8F0028]' }, // Or #E8B83F depending on context, let's use maroon for icons
  { from: /text-\[var\(--color-rm-bg-deep\)\]/g, to: 'text-white' },
  { from: /bg-\[var\(--color-rm-gold\)\]/g, to: 'bg-[#8F0028]' }, // Primary buttons to maroon
  { from: /from-\[var\(--color-rm-maroon\)\] via-\[\#6a0d28\] to-\[var\(--color-rm-bg-deep\)\]/g, to: 'from-[#3A000E] via-[#520014] to-[#6B0019]' },
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('About components updated.');
