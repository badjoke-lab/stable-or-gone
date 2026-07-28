import fs from 'node:fs';

const updates = [];
const replace = (file, from, to, label) => {
  const current = fs.readFileSync(file, 'utf8');
  if (!current.includes(from)) throw new Error(`${label}: expected source block not found in ${file}`);
  const next = current.replace(from, to);
  if (next === current) throw new Error(`${label}: replacement made no change in ${file}`);
  fs.writeFileSync(file, next);
  updates.push({ file, label });
};

replace(
  'src/pages/index.astro',
  "import { getStablecoins, getOrganizations, getRelationships, getEvents, getEvidence } from '../lib/data/registry';",
  "import { getStablecoins, getOrganizations, getRelationships, getEvents, getEvidence } from '../lib/data/registry';\nimport { getEvidenceSourceIdentitySummary } from '../lib/data/evidenceSources';",
  'restore canonical evidence identity summary import'
);
replace(
  'src/pages/index.astro',
  "const evidence = getEvidence();",
  "const evidence = getEvidence();\nconst evidenceSummary = getEvidenceSourceIdentitySummary();",
  'restore canonical evidence identity summary'
);
replace(
  'src/pages/index.astro',
  `        <div><dt>Stablecoins</dt><dd>{stablecoins.length}</dd></div>\n        <div><dt>Organizations</dt><dd>{organizations.length}</dd></div>\n        <div><dt>Events</dt><dd>{events.length}</dd></div>\n        <div><dt>Evidence</dt><dd>{evidence.length}</dd></div>`,
  `        <div><dt>Stablecoins</dt><dd>{stablecoins.length}<small> stable assets</small></dd></div>\n        <div><dt>Organizations</dt><dd>{organizations.length}<small> organizations</small></dd></div>\n        <div><dt>Events</dt><dd>{events.length}<small> events</small></dd></div>\n        <div><dt>Evidence</dt><dd>{evidence.length}<small> source records</small><small>Source identities {evidenceSummary.source_identities}</small></dd></div>`,
  'preserve release count phrases and source identities'
);

replace(
  'src/styles/public-ui.css',
  '  --ui-quiet: #7f8784;',
  '  --ui-quiet: #848c89;',
  'raise quiet contrast above contract threshold'
);
replace(
  'src/styles/public-ui.css',
  '.footer-links a, .v3-footer-links a { min-height: 0; padding: 0; border-bottom: 1px solid var(--ui-line-strong); color: var(--ui-muted); font-size: .7rem; }',
  '.footer-links a, .v3-footer-links a { min-height: 0; padding: 0; border-bottom: 1px solid var(--ui-line-strong); color: var(--ui-muted); font-size: .7rem; }\n.footer-links a:hover, .v3-footer-links a:hover { color: var(--ui-hover); border-color: var(--ui-hover); }',
  'restore explicit footer hover state'
);
replace(
  'src/styles/public-ui.css',
  '.home-facts dd { margin: 0; color: var(--ui-text); font: 600 2.4rem var(--ui-serif); letter-spacing: -.03em; }',
  '.home-facts dd { margin: 0; color: var(--ui-text); font: 600 2.4rem var(--ui-serif); letter-spacing: -.03em; }\n.home-facts dd small { display: block; margin-top: 4px; color: var(--ui-muted); font: 700 .64rem/1.4 var(--ui-mono); letter-spacing: .06em; text-transform: uppercase; }',
  'add CYA-style fact captions'
);
replace(
  'src/styles/public-ui.css',
  'td small { display: block; margin-top: 3px; }',
  'td small { display: block; margin-top: 3px; }\n.home-registry-table td small { color: var(--ui-quiet); }\n.compare-preset { background: transparent; color: var(--ui-text); }\n.compare-preset small { color: var(--ui-muted); }',
  'fix quiet sample and compare control contrast'
);
replace(
  'src/styles/public-ui.css',
  '  .site-nav, .site-primary-navigation { margin-inline: -14px; padding-inline: 14px; }',
  '  .site-nav, .site-primary-navigation { padding-inline: 0; }',
  'remove mobile document overflow'
);
replace(
  'src/styles/public-ui.css',
  '  :where(.organization-detail-table,.event-detail-table,.stablecoin-detail-table,.evidence-table-wrap) { display: none; }',
  '  table[data-mobile-table] { display: none; }\n  .evidence-table-wrap { display: block; overflow: visible; }',
  'hide desktop tables without hiding mobile evidence records'
);

replace(
  'scripts/validate-ui-v3-cleanup.mjs',
  `    '.chip, [class*="badge"]', 'border-radius: var(--ui-pill)',\n    '.event-structured-detail', '.event-detail-evidence-r5',\n    '.home-ledger', '.stablecoin-index-page', '.event-index-page', '.organization-index-page',`,
  `    '.chip, [class*="badge"]', '--ui-radius: 0;', '--ui-pill: 0;', 'border-radius: 0', 'background: transparent',\n    '.event-structured-detail', '.event-detail-evidence-r5',\n    '.home-ledger', '.home-intro', '.home-facts', '.editorial-directory', '.registry-panel', '.home-registry-table', '.stablecoin-index-page', '.event-index-page', '.organization-index-page',`,
  'replace SaaS surface markers with CYA flat registry markers'
);
replace(
  'scripts/validate-ui-v3-cleanup.mjs',
  "    '@media (max-width: 820px)'",
  "    '@media (max-width: 640px)'",
  'align cleanup validator with CYA mobile breakpoint'
);
replace(
  'scripts/validate-ui-v3-cleanup.mjs',
  "    badges: 'shape, padding, border, background, and readable state text are mandatory',",
  "    badges: 'flat square underlined state labels with readable text are mandatory',",
  'record CYA status-label contract'
);

replace(
  'scripts/audit-public-typography-enums-direct.mjs',
  `            '.home-register-strip strong',\n            '.home-status-ledger dd',`,
  `            '.home-register-strip strong',\n            '.home-facts dd',\n            '.directory-copy strong',\n            '.home-status-ledger dd',`,
  'allow CYA editorial fact numerals'
);
replace(
  'scripts/audit-public-typography-enums-direct.mjs',
  `            '.home-masthead__edition',\n            '.home-section-kicker',`,
  `            '.home-masthead__edition',\n            '.archive-note',\n            '.directory-number',\n            '.chip',\n            '[class*="badge"]',\n            '[class*="status-chip"]',\n            '[data-tone]',\n            '.home-status-label',\n            '.update-feed-category',\n            '.ar-chip',\n            '.ar-lifecycle',\n            '.home-section-kicker',`,
  'allow CYA monospaced status labels'
);
replace(
  'scripts/audit-public-typography-enums-direct.mjs',
  `            const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;\n            const paddingInline = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);\n            const borderWidth = Number.parseFloat(style.borderTopWidth) || 0;\n            const background = parseRgb(style.backgroundColor);\n            const transparent = !background || background[3] < .08;\n            if (rect.height < 24 || radius < 8 || paddingInline < 10 || borderWidth < 1 || transparent) {\n              invalidBadges.push({ element: pathFor(element), text: displayText(element).slice(0, 100), height_px: Math.round(rect.height), border_radius_px: radius, padding_inline_px: Number(paddingInline.toFixed(1)), border_width_px: borderWidth, background: style.backgroundColor });\n            }`,
  `            const radius = Number.parseFloat(style.borderTopLeftRadius) || 0;\n            const borderBottomWidth = Number.parseFloat(style.borderBottomWidth) || 0;\n            const background = parseRgb(style.backgroundColor);\n            const transparent = !background || background[3] < .08;\n            if (rect.height < 14 || radius !== 0 || borderBottomWidth < 1 || !transparent) {\n              invalidBadges.push({ element: pathFor(element), text: displayText(element).slice(0, 100), height_px: Math.round(rect.height), border_radius_px: radius, border_bottom_width_px: borderBottomWidth, background: style.backgroundColor });\n            }`,
  'audit flat underlined status labels instead of filled pills'
);
replace(
  'scripts/audit-public-typography-enums-direct.mjs',
  "interaction_contract: { hover: '--ui-link-hover or --ui-text in navigation', badges: 'bordered filled pills', text_contrast: 'WCAG AA' },",
  "interaction_contract: { hover: '--ui-hover or --ui-text in navigation', badges: 'flat square underlined status labels', text_contrast: 'WCAG AA' },",
  'report CYA interaction contract'
);

replace(
  'scripts/audit-representative-text-contrast.mjs',
  `      body: ['.home-masthead__title p', '.home-material-list p', '.home-guide-list p', '.home-reference-index nav a span'],\n      muted: ['.home-masthead__edition', '.home-register-strip a', '.home-section-heading > a', '.home-registry-links a'],\n      quiet: ['.home-search__heading p', '.home-search__popular', '.home-material-list__meta', '.home-registry-state__note', '.home-guide-list__meta']`,
  `      body: ['.home-intro .lede', '.section-heading > p', '.directory-copy small', '.home-registry-table td'],\n      muted: ['.archive-note', '.registry-count', '.home-registry-table th'],\n      quiet: ['.home-registry-table td small']`,
  'audit current CYA homepage roles'
);

console.log(JSON.stringify({ ok: true, update_count: updates.length, updates }, null, 2));
