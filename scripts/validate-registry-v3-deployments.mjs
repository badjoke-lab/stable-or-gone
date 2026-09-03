import fs from 'node:fs';
import path from 'node:path';

const scriptPath = new URL('./validate-registry-v3-deployments-core.mjs', import.meta.url);
let source = fs.readFileSync(scriptPath, 'utf8');
const anchor = 'const baseline=readJson(baselinePath)??{};';
if (!source.includes(anchor)) throw new Error('deployment baseline anchor missing');
const replacement = `
const baselineBase=readJson(baselinePath)??{};
const baselineGroups={...(baselineBase.data_groups??{})};
const minimumCounts={...(baselineBase.minimum_counts??{})};
const migrationDir=path.join(root,'docs/migration');
const overlayPaths=fs.readdirSync(migrationDir).filter((name)=>/^registry-v2-baseline-batch-[a-z]+\\.json$/i.test(name)).sort().map((name)=>\`docs/migration/\${name}\`);
for(const overlayPath of overlayPaths){const overlay=readJson(overlayPath)??{};for(const [name,value] of Object.entries(overlay.minimum_counts??{})){if(Number.isFinite(value)&&Number.isFinite(minimumCounts[name]))minimumCounts[name]=Math.max(minimumCounts[name],value);else minimumCounts[name]=value;}for(const [name,additions] of Object.entries(overlay.data_group_additions??{})){baselineGroups[name]=[...new Set([...(baselineGroups[name]??[]),...additions])];}}
const baseline={...baselineBase,minimum_counts:minimumCounts,data_groups:baselineGroups};
`;
source = source.replace(anchor, replacement);
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
