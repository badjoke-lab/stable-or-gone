import fs from 'node:fs';

const replace = (file, from, to, label) => {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes(from)) throw new Error(`${label}: source block missing`);
  fs.writeFileSync(file, source.replace(from, to));
};

replace(
  'src/styles/public-ui.css',
  'a:visited { color: inherit; }',
  'a:visited { color: inherit; }\na:active { color: var(--ui-text); }',
  'add active link state'
);
replace(
  'src/styles/public-ui.css',
  '.mobile-definition-list > div, .mobile-record-list > article, .mobile-table-record, .mobile-evidence-record, .mobile-empty-record { min-width: 0; padding: 12px 0; border: 0; border-bottom: 1px solid var(--ui-text); border-radius: 0; background: transparent; }',
  '.mobile-definition-list > div, .mobile-record-list > article, .mobile-table-record, .mobile-evidence-record, .mobile-empty-record { min-width: 0; padding: 12px 0; border: 0; border-bottom: 1px solid var(--ui-text); border-radius: 0; background: transparent; }\n.event-structured-detail { min-width: 0; border-top: 1px solid var(--ui-line-strong); }\n.event-detail-evidence-r5 { min-width: 0; max-width: 100%; }',
  'add flat event structure markers'
);
replace(
  'scripts/audit-representative-text-contrast.mjs',
  "      body: ['.home-intro .lede', '.section-heading > p', '.directory-copy small', '.home-registry-table td'],\n      muted: ['.archive-note', '.registry-count', '.home-registry-table th'],",
  "      body: ['.home-intro .lede', '.section-heading > p', '.home-registry-table td'],\n      muted: ['.archive-note', '.registry-count', '.home-registry-table th', '.directory-copy small'],",
  'classify CYA directory captions as muted copy'
);

console.log(JSON.stringify({ ok: true, files: ['src/styles/public-ui.css', 'scripts/audit-representative-text-contrast.mjs'] }, null, 2));
