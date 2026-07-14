import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['identity', 'scripts/validate-registry-identity-lineage-audit.mjs'],
  ['organization_relationship', 'scripts/validate-registry-organization-relationship-audit.mjs'],
  ['evidence_integrity', 'scripts/validate-registry-evidence-integrity-audit.mjs'],
  ['reserve_redemption', 'scripts/validate-registry-reserve-redemption-backing-audit.mjs'],
  ['deployment_chain_identity', 'scripts/validate-registry-deployment-chain-identity-audit.mjs'],
];
const results = [];
for (const [name, script] of checks) {
  const run = spawnSync(process.execPath, [script], {encoding:'utf8', env:process.env, maxBuffer:30*1024*1024});
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  results.push({name, ok:run.status === 0, status:run.status, output_tail:output.split('\n').slice(-80).join('\n')});
  if (run.status !== 0) break;
}
fs.mkdirSync('artifacts/pr359', {recursive:true});
fs.writeFileSync('artifacts/pr359/ci-deployment-order.json', `${JSON.stringify({ok:results.every((row)=>row.ok),results},null,2)}\n`);
console.log(JSON.stringify({ok:results.every((row)=>row.ok),checks:Object.fromEntries(results.map((row)=>[row.name,row.ok]))},null,2));
