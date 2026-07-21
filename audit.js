const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'supabase', 'migrations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql'));

let tables = new Set();
let rls = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Match CREATE TABLE
  let match;
  const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/g;
  while ((match = createRegex.exec(content)) !== null) {
    tables.add(match[1]);
  }
  
  // Match RLS
  const rlsRegex = /ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/g;
  while ((match = rlsRegex.exec(content)) !== null) {
    rls.add(match[1]);
  }
});

const missing = [...tables].filter(t => !rls.has(t));
console.log('Missing RLS:', missing);
