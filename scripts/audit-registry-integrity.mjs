import fs from 'node:fs';

const basePath = new URL('./audit-registry-integrity-base.mjs', import.meta.url);
let source = fs.readFileSync(basePath, 'utf8');
const oldCheck = `if (baseline.minimum_counts?.[key] !== undefined && baseline.minimum_counts[key] !== actual) {\n    warnings.push(\`Baseline minimum \${key}=\${baseline.minimum_counts[key]}, actual=\${actual}\`);\n  }`;
const newCheck = `if (baseline.minimum_counts?.[key] !== undefined && actual < baseline.minimum_counts[key]) {\n    critical.push(\`Baseline minimum \${key}=\${baseline.minimum_counts[key]} exceeds actual=\${actual}\`);\n  }`;
if (!source.includes(oldCheck)) throw new Error('Audit minimum-count patch anchor is missing');
source = source.replace(oldCheck, newCheck);
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
