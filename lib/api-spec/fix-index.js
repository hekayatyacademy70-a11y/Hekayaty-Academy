const fs = require('fs');
const path = require('path');

// Fix api-zod index - remove duplicate exports that Orval generates
const zodIndexPath = path.resolve(__dirname, '../api-zod/src/index.ts');
fs.writeFileSync(zodIndexPath, `export * as zodSchemas from "./generated/api";\nexport * from "./generated/types";\n`);
console.log('Fixed api-zod/src/index.ts');

// Fix api-client-react index - remove duplicate exports
const clientIndexPath = path.resolve(__dirname, '../api-client-react/src/index.ts');
const clientContent = fs.readFileSync(clientIndexPath, 'utf-8');
// Remove duplicate lines by converting to Set
const lines = clientContent.split('\n');
const seen = new Set();
const deduped = lines.filter(line => {
  const trimmed = line.trim();
  if (!trimmed) return true; // keep empty lines (but only once)
  if (seen.has(trimmed)) return false;
  seen.add(trimmed);
  return true;
});
// Keep exactly one trailing newline
const result = deduped.join('\n').replace(/\n+$/, '\n');
fs.writeFileSync(clientIndexPath, result);
console.log('Fixed api-client-react/src/index.ts');
