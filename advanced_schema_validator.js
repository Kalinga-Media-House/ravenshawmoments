const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'supabase', 'migrations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

const schema = {}; // table -> Map of columns { type, constraints }

const sqlKeywords = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'IN', 'IS', 'NOT', 'NULL', 'TRUE', 'FALSE', 'AS',
  'JOIN', 'ON', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'EXISTS', 'ANY', 'ALL', 'WITH', 'CHECK',
  'USING', 'auth.uid', 'auth.jwt', 'auth.email', 'app.is_admin', 'app.is_admin_or_super',
  'app.current_profile_id', 'app.utc_now', 'uuid', 'text', 'boolean', 'integer', 'date',
  'timestamp', 'timestamptz', 'varchar', 'numeric', 'uuid_generate_v4', 'gen_random_uuid',
  'current_setting', 'COALESCE', 'NOW', 'COUNT', 'SUM', 'MAX', 'MIN', 'p'
]);

function parseTableSchema(sql) {
  // CREATE TABLE
  const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/g;
  let match;
  while ((match = createRegex.exec(sql)) !== null) {
    const table = match[1];
    if (!schema[table]) schema[table] = new Map();
    
    const lines = match[2].split(/\r?\n/);
    let openParens = 0;
    let currentLine = '';
    
    for (let rawLine of lines) {
      currentLine += rawLine.trim() + ' ';
      openParens += (rawLine.match(/\(/g) || []).length;
      openParens -= (rawLine.match(/\)/g) || []).length;
      
      if (openParens <= 0 && currentLine.includes(',')) {
        const parts = currentLine.split(',');
        for (let i = 0; i < parts.length - 1; i++) {
           processColumnDef(table, parts[i].trim());
        }
        currentLine = parts[parts.length - 1].trim();
        openParens = 0;
      }
    }
    if (currentLine) {
      processColumnDef(table, currentLine);
    }
  }
  
  // ALTER TABLE ADD
  const alterAdd = /ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s+([^;]+);/g;
  while ((match = alterAdd.exec(sql)) !== null) {
    const table = match[1];
    const col = match[2];
    if (schema[table]) schema[table].set(col, match[3]);
  }
  
  // ALTER TABLE DROP
  const alterDrop = /ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z0-9_]+)\s+DROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+);/g;
  while ((match = alterDrop.exec(sql)) !== null) {
    if (schema[match[1]]) schema[match[1]].delete(match[2]);
  }
}

function processColumnDef(table, def) {
  if (!def || def.startsWith('--') || def.startsWith('UNIQUE') || def.startsWith('PRIMARY KEY') || def.startsWith('FOREIGN KEY') || def.startsWith('CONSTRAINT')) {
    return;
  }
  const parts = def.split(/\s+/);
  if (parts.length >= 2) {
    let col = parts[0].replace(/"/g, '');
    schema[table].set(col, parts.slice(1).join(' '));
  }
}

files.forEach(file => {
  const sql = fs.readFileSync(path.join(dir, file), 'utf8');
  parseTableSchema(sql);
});

console.log(`Parsed ${Object.keys(schema).length} tables.`);

// Parse policies in 022 and 032
let errors = 0;

function validatePolicy(file, table, policyName, clauseType, expression) {
  // Strip string literals
  const stripped = expression.replace(/'[^']*'/g, "''");
  
  const words = stripped.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g) || [];
  
  const aliases = new Set(['p', 'r', 'm']); // Known aliases in subqueries
  
  for (let word of words) {
    const wUpper = word.toUpperCase();
    if (sqlKeywords.has(wUpper) || sqlKeywords.has(word) || aliases.has(word) || word === 'auth' || word === 'uid' || word === 'app') continue;
    
    // Function calls
    if (stripped.includes(`${word}(`)) continue;
    
    // It's a column identifier
    if (!schema[table]) {
      console.error(`[${file}] [${policyName}] Table not found: ${table}`);
      errors++;
      continue;
    }
    
    // Check if it's a known column
    if (!schema[table].has(word)) {
      // maybe it's in a subquery? This parser is naive, so we just log a warning instead of error
      // But we will print it to inspect manually
      console.log(`[WARNING] [${file}] Table '${table}', Policy '${policyName}': Column '${word}' might not exist. Found in: ${clauseType} (${expression.substring(0, 50)}...)`);
    }
  }
}

['022_profile_system_rls_policies.sql', '032_security_rls_remediation.sql'].forEach(file => {
  if (!fs.existsSync(path.join(dir, file))) return;
  const sql = fs.readFileSync(path.join(dir, file), 'utf8');
  
  const policyRegex = /CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+(?:public\.)?([a-zA-Z0-9_]+)[\s\S]*?(?:USING\s*\(([\s\S]*?)\))?(?:\s*WITH\s+CHECK\s*\(([\s\S]*?)\))?;/g;
  
  let match;
  while ((match = policyRegex.exec(sql)) !== null) {
    const policyName = match[1];
    const table = match[2];
    const usingExp = match[3];
    const checkExp = match[4];
    
    if (usingExp) validatePolicy(file, table, policyName, 'USING', usingExp);
    if (checkExp) validatePolicy(file, table, policyName, 'WITH CHECK', checkExp);
  }
});

console.log(`Validation complete. Check warnings.`);
