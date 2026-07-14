import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function replaceRows(targetFile, sourceFile, ids) {
  const target = readJson(targetFile);
  const source = new Map(readJson(sourceFile).map((row) => [row.id, row]));
  const found = new Set();
  const next = target.map((row) => {
    if (!ids.includes(row.id)) return row;
    const replacement = source.get(row.id);
    if (!replacement) throw new Error(`${sourceFile}: missing replacement ${row.id}`);
    found.add(row.id);
    return replacement;
  });
  for (const id of ids) if (!found.has(id)) throw new Error(`${targetFile}: missing target ${id}`);
  writeJson(targetFile, next);
}

replaceRows(
  'data/stablecoin-profiles-v2.json',
  'data/stablecoin-profiles-pr364-tier-a-batch-4.json',
  ['sog_st_usdg']
);
replaceRows(
  'data/legal-profiles-v3-batch-d2a.json',
  'data/legal-profiles-v3-pr364-tier-a-batch-4.json',
  ['sog_st_usdg', 'sog_st_usds']
);
replaceRows(
  'data/known-unknowns-extra.json',
  'data/known-unknowns-pr364-tier-a-batch-4.json',
  ['sog_unknown_usdg_issuer_entity', 'sog_unknown_usdg_redemption_path']
);

const foundationPath = 'docs/migration/registry-v3-foundation.json';
const foundation = readJson(foundationPath);
foundation.data_groups.legal_profiles = foundation.data_groups.legal_profiles.filter(
  (file) => file !== 'data/legal-profiles-v3-pr364-tier-a-batch-4.json'
);
writeJson(foundationPath, foundation);

const overlayPath = 'docs/migration/registry-v2-baseline-batch-zzzz.json';
const overlay = readJson(overlayPath);
delete overlay.data_group_additions.profiles;
delete overlay.data_group_additions.known_unknowns;
writeJson(overlayPath, overlay);

const findingsPath = 'docs/migration/tier-a-dossier-batch-4-pr364-findings.json';
const findings = readJson(findingsPath);
const replacements = new Map([
  ['data/stablecoin-profiles-pr364-tier-a-batch-4.json', 'data/stablecoin-profiles-v2.json'],
  ['data/legal-profiles-v3-pr364-tier-a-batch-4.json', 'data/legal-profiles-v3-batch-d2a.json'],
  ['data/known-unknowns-pr364-tier-a-batch-4.json', 'data/known-unknowns-extra.json']
]);
for (const finding of findings.findings) {
  finding.canonical_files_changed = [...new Set((finding.canonical_files_changed ?? []).map((file) => replacements.get(file) ?? file))];
}
writeJson(findingsPath, findings);

for (const file of [
  'data/stablecoin-profiles-pr364-tier-a-batch-4.json',
  'data/legal-profiles-v3-pr364-tier-a-batch-4.json',
  'data/known-unknowns-pr364-tier-a-batch-4.json'
]) fs.rmSync(file);

console.log(JSON.stringify({
  ok: true,
  updated_existing_files: [
    'data/stablecoin-profiles-v2.json',
    'data/legal-profiles-v3-batch-d2a.json',
    'data/known-unknowns-extra.json'
  ],
  removed_temporary_override_files: 3
}, null, 2));
