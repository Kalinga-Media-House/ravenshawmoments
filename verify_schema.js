const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'supabase', 'migrations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql'));

// 1. Build Schema Map
const schema = {}; // table -> set of columns

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // A naive but effective parser for CREATE TABLE blocks
  const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\);/g;
  let match;
  while ((match = createRegex.exec(content)) !== null) {
    const table = match[1];
    const columnsBlock = match[2];
    
    if (!schema[table]) schema[table] = new Set();
    
    // Split by commas, but ignore commas inside parentheses (like numeric(8,2))
    const lines = columnsBlock.split(/\r?\n/);
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('--') || line.startsWith('UNIQUE') || line.startsWith('PRIMARY KEY') || line.startsWith('FOREIGN KEY') || line.startsWith('CONSTRAINT')) {
        continue;
      }
      
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        let col = parts[0];
        // Remove quotes if any
        col = col.replace(/"/g, '');
        if (col && !col.toUpperCase().startsWith('FOREIGN') && !col.toUpperCase().startsWith('UNIQUE') && !col.toUpperCase().startsWith('CHECK') && !col.toUpperCase().startsWith('PRIMARY')) {
           schema[table].add(col);
        }
      }
    }
  }
});

let errors = 0;

function checkColumn(table, column) {
  if (!schema[table]) {
    console.error(`ERROR: Table ${table} not found in schema!`);
    errors++;
    return;
  }
  if (!schema[table].has(column)) {
    console.error(`ERROR: Column ${column} does not exist in table ${table}!`);
    errors++;
  } else {
    console.log(`OK: ${table}.${column} exists.`);
  }
}

// 2. Validate specific logic in 032
console.log("Validating 032_security_rls_remediation.sql assumptions...");

const ownerDataTables = ['competition_registrations', 'competition_team_members', 'entity_follows', 'bookmarks'];
ownerDataTables.forEach(t => {
  checkColumn(t, 'profile_id');
});

const compSubTables = ['competition_submissions'];
compSubTables.forEach(t => {
  checkColumn(t, 'registration_id');
});

const mediaFiles = ['media_files'];
mediaFiles.forEach(t => {
  checkColumn(t, 'owner_profile_id');
});

const attachments = ['attachments'];
attachments.forEach(t => {
  checkColumn(t, 'media_file_id');
});

const contentItems = ['content_items'];
contentItems.forEach(t => {
  checkColumn(t, 'author_profile_id');
});

const profileFollows = ['profile_follows'];
profileFollows.forEach(t => {
  checkColumn(t, 'follower_profile_id');
  checkColumn(t, 'following_profile_id');
});

console.log("Validating 022_profile_system_rls_policies.sql assumptions...");
const verifLogs = ['verification_logs'];
verifLogs.forEach(t => {
  // We already removed actor_id, let's verify what columns exist
  console.log('verification_logs columns:', Array.from(schema[t] || []).join(', '));
});

if (errors > 0) {
  console.error(`\nFAILED: Found ${errors} schema validation errors!`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All validated columns exist in the schema.`);
}
