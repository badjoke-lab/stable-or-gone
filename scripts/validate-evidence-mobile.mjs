import fs from 'node:fs';
import { evidenceMobileFields } from './evidence-mobile-fields.mjs';

const source = fs.readFileSync('src/components/EvidenceSourceTable.astro', 'utf8');
const missing = evidenceMobileFields.filter((field) => !source.includes(`>${field}<`));
if (missing.length) throw new Error(`Missing evidence fields: ${missing.join(', ')}`);

const requiredIdentityTerms = [
  'getEvidenceSourceIdentities',
  'resolveEvidenceIdentityId',
  'data-evidence-record-count',
  'data-source-identity-count',
  'data-mobile-table="scroll-preserve"'
];
const missingIdentityTerms = requiredIdentityTerms.filter((term) => !source.includes(term));
if (missingIdentityTerms.length) throw new Error(`Missing evidence identity mobile protections: ${missingIdentityTerms.join(', ')}`);

console.log(JSON.stringify({
  ok: true,
  fields: evidenceMobileFields,
  source_identity_protections: requiredIdentityTerms
}, null, 2));
