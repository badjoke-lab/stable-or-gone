import fs from 'node:fs';

const basePath = new URL('./audit-registry-integrity-base.mjs', import.meta.url);
const outputPath = new URL('./audit-registry-integrity.mjs', import.meta.url);
let source = fs.readFileSync(basePath, 'utf8');

const replaceOnce = (anchor, replacement, label) => {
  if (!source.includes(anchor)) throw new Error(`Audit patch anchor is missing: ${label}`);
  source = source.replace(anchor, replacement);
};

replaceOnce(
  `if (baseline.minimum_counts?.[key] !== undefined && baseline.minimum_counts[key] !== actual) {\n    warnings.push(\`Baseline minimum \${key}=\${baseline.minimum_counts[key]}, actual=\${actual}\`);\n  }`,
  `if (baseline.minimum_counts?.[key] !== undefined && actual < baseline.minimum_counts[key]) {\n    critical.push(\`Baseline minimum \${key}=\${baseline.minimum_counts[key]} exceeds actual=\${actual}\`);\n  }`,
  'baseline minimums'
);

replaceOnce(
  `const requiredCoverage = new Set([\n  'classifications', 'profiles', 'relationships', 'evidence', 'known_unknowns',\n  'legal_profiles', 'reserve_components', 'income_profiles'\n]);`,
  `const requiredCoverage = new Set([\n  'classifications', 'profiles', 'relationships', 'evidence', 'known_unknowns',\n  'legal_profiles', 'reserve_components', 'income_profiles'\n]);\nconst informationalCoverage = new Set(['reserve_reports']);\nconst coverageExpectation = (label) => requiredCoverage.has(label)\n  ? 'required'\n  : informationalCoverage.has(label)\n    ? 'informational'\n    : 'optional_review';`,
  'coverage expectations'
);

replaceOnce(
  `  if (requiredCoverage.has(label)) {\n    for (const id of missing) critical.push(\`\${label} coverage is missing \${id}\`);\n  } else if (missing.length) {\n    warnings.push(\`\${label} coverage \${covered.size}/\${stablecoinIds.size}; missing \${missing.join(', ')}\`);\n  }`,
  `  if (requiredCoverage.has(label)) {\n    for (const id of missing) critical.push(\`\${label} coverage is missing \${id}\`);\n  } else if (missing.length && informationalCoverage.has(label)) {\n    observations.push(\`\${label} context coverage is \${covered.size}/\${stablecoinIds.size}; this publication-specific layer is informational and is not expected for every asset. Missing: \${missing.join(', ')}.\`);\n  } else if (missing.length) {\n    warnings.push(\`\${label} coverage \${covered.size}/\${stablecoinIds.size}; missing \${missing.join(', ')}\`);\n  }`,
  'informational coverage handling'
);

replaceOnce(
  `  coverage: Object.fromEntries(Object.entries(allCoverage).map(([label, covered]) => [label, {\n    covered: covered.size,\n    total: stablecoinIds.size,\n    required: requiredCoverage.has(label)\n  }])),`,
  `  coverage: Object.fromEntries(Object.entries(allCoverage).map(([label, covered]) => [label, {\n    covered: covered.size,\n    total: stablecoinIds.size,\n    required: requiredCoverage.has(label),\n    expectation: coverageExpectation(label)\n  }])),`,
  'coverage summary'
);

replaceOnce(
  `    historical_missing_discontinued_date: missingEnd.length,\n    all_unknown_income_profiles: unknownIncome.length`,
  `    historical_missing_discontinued_date: missingEnd.length,\n    all_unknown_income_profiles: unknownIncome.length,\n    reserve_report_context_coverage: {\n      covered: allCoverage.reserve_reports.size,\n      total: stablecoinIds.size\n    }`,
  'reserve report quality metric'
);

replaceOnce(
  `  '- Optional event, reserve-report, and deployment coverage visibility',`,
  `  '- Required, optional-review, and informational coverage visibility',`,
  'scope wording'
);

replaceOnce(
  `  '| Layer | Covered | Required |', '|---|---:|:---:|',\n  ...Object.entries(allCoverage).map(([label, covered]) => \`| \${label} | \${covered.size} / \${stablecoinIds.size} | \${requiredCoverage.has(label) ? 'yes' : 'no'} |\`), '',`,
  `  '| Layer | Covered | Expectation |', '|---|---:|---|',\n  ...Object.entries(allCoverage).map(([label, covered]) => \`| \${label} | \${covered.size} / \${stablecoinIds.size} | \${coverageExpectation(label)} |\`), '',`,
  'coverage table'
);

replaceOnce(
  `  critical.length === 0\n    ? 'The 70-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.'\n    : 'The registry does not pass the final audit until all critical findings are resolved.', ''`,
  `  critical.length === 0 && warnings.length === 0\n    ? 'The 70-record canonical registry passes the cross-layer integrity audit with no critical findings or warnings. Informational coverage metrics remain visible without implying universal applicability.'\n    : critical.length === 0\n      ? 'The 70-record canonical registry passes the cross-layer integrity audit. Warnings remain non-blocking review queues and do not represent broken references or duplicate canonical identities.'\n      : 'The registry does not pass the final audit until all critical findings are resolved.', ''`,
  'result wording'
);

fs.writeFileSync(outputPath, source);
console.log('Flattened integrity audit script written.');
