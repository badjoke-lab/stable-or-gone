import fs from 'node:fs';

const requiredUsage = {
  'src/components/EvidenceSourceTable.astro': [
    'getEvidenceSourceIdentities',
    'resolveEvidenceIdentityId',
    'data-evidence-record-count',
    'data-source-identity-count',
    'EvidenceRows evidence={sourceIdentities}'
  ],
  'src/lib/data/evidenceSources.ts': [
    'deduplicateEvidenceRecords',
    'getCanonicalEvidenceRelations',
    'getEvidenceSourceIdentitySummary',
    'orphan_relation_source_ids'
  ],
  'src/lib/data/manifestBase.ts': [
    "'evidence_source_identity'",
    'evidence_source_identity: evidenceSourceIdentity'
  ],
  'src/lib/versionBase.ts': [
    'evidence_source_identity: evidenceSourceIdentity'
  ],
  'scripts/build-evidence-source-identity-stats.mjs': [
    'public_source_identities',
    'evidence_relations',
    'public_duplicate_url_groups',
    'orphan_relation_source_ids'
  ],
  'scripts/validate-registry-stats.mjs': [
    'applyEvidenceSourceIdentityStats',
    'public source identity projection must contain zero duplicate URL groups'
  ],
  'scripts/validate-evidence-mobile.mjs': [
    'source_identity_protections'
  ]
};

const forbiddenUsage = {
  'src/components/EvidenceSourceTable.astro': [
    'EvidenceRows evidence={evidence}'
  ]
};

const failures = [];
for (const [file, terms] of Object.entries(requiredUsage)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const term of terms) {
    if (!source.includes(term)) failures.push(`${file}: missing evidence source identity surface term: ${term}`);
  }
}
for (const [file, terms] of Object.entries(forbiddenUsage)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const term of terms) {
    if (source.includes(term)) failures.push(`${file}: raw duplicate evidence rows remain on a public table: ${term}`);
  }
}

if (failures.length > 0) throw new Error(failures.join('\n'));
console.log(JSON.stringify({
  ok: true,
  protected_surfaces: Object.keys(requiredUsage).length,
  forbidden_raw_row_patterns: Object.values(forbiddenUsage).flat().length
}, null, 2));
