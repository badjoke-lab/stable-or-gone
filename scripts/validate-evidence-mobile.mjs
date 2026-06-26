import fs from 'node:fs';
import { evidenceMobileFields } from './evidence-mobile-fields.mjs';

const source = fs.readFileSync('src/components/EvidenceSourceTable.astro', 'utf8');
const missing = evidenceMobileFields.filter((field) => !source.includes(`>${field}<`));
if (missing.length) throw new Error(`Missing evidence fields: ${missing.join(', ')}`);
console.log(JSON.stringify({ ok: true, fields: evidenceMobileFields }, null, 2));
