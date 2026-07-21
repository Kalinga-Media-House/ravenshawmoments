const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove legacy glass-card wrappers to allow bg-white to work
    content = content.replace(/rm-glass-card/g, 'bg-white shadow-sm');
    
    // Replace text colors for light theme (excluding Hero which is handled by InnerPageHero)
    // We want text-[#171214] for headings and text-[#756A6E] for body text.
    content = content.replace(/text-white\/[0-9]+/g, 'text-[#756A6E]');
    
    // Replace text-white but be careful about buttons.
    // If it's a button with bg-[#8F0028] or bg-[#4A0012], we KEEP text-white.
    // To do this simply, we will change all `text-white` to `text-[#171214]`,
    // and then fix specific buttons if they are broken.
    content = content.replace(/text-white/g, 'text-[#171214]');
    
    // Replace background and border utility classes
    content = content.replace(/bg-white\/[0-9]+/g, 'bg-white');
    content = content.replace(/border-white\/[0-9]+/g, 'border-[#8F0028]/10');
    content = content.replace(/bg-black\/20/g, 'bg-[#8F0028]/5');
    content = content.replace(/bg-black\/40/g, 'bg-[#8F0028]/5');
    
    // Replace variables
    content = content.replace(/bg-\[var\(--color-rm-background\)\]/g, 'bg-[#FFFDF8]');
    content = content.replace(/bg-\[var\(--color-rm-bg-deep\)\]/g, 'bg-[#FFFDF8]');
    content = content.replace(/bg-\[var\(--color-rm-maroon\)\]\/[0-9]+/g, 'bg-[#8F0028]/10');
    content = content.replace(/border-\[var\(--color-rm-gold\)\]\/[0-9]+/g, 'border-[#E8B83F]/30');
    content = content.replace(/border-\[var\(--color-rm-gold\)\]/g, 'border-[#E8B83F]');
    content = content.replace(/text-\[var\(--color-rm-gold\)\]/g, 'text-[#8F0028]');
    content = content.replace(/text-\[var\(--color-rm-bg-deep\)\]/g, 'text-white');
    content = content.replace(/bg-\[var\(--color-rm-gold\)\]/g, 'bg-[#8F0028]');
    
    // Re-fix primary buttons that got their text-white overwritten to text-[#171214]
    content = content.replace(/bg-\[\#8F0028\] text-\[\#171214\]/g, 'bg-[#8F0028] text-white');
    content = content.replace(/bg-\[\#4A0012\] text-\[\#171214\]/g, 'bg-[#4A0012] text-white');
    content = content.replace(/bg-primary text-\[\#171214\]/g, 'bg-primary text-white');
    
    // Re-fix specific components if needed
    // e.g., Hero components shouldn't be light-themed for their text, but they use InnerPageHero which has its own classes, so they are fine.
    // If a component has an absolute overlay that uses bg-gradient, let's just make sure it's not overriding text colors.
    
    fs.writeFileSync(filePath, content, 'utf-8');
  });
}

processDir('C:\\Projects\\ravenshawmoments\\src\\features\\about\\components');
processDir('C:\\Projects\\ravenshawmoments\\src\\features\\donation\\components');
processDir('C:\\Projects\\ravenshawmoments\\src\\features\\donation');

console.log('Theme fix completed.');
