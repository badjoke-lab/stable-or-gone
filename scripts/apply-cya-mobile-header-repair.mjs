import fs from 'node:fs';

const updates = [];
const replace = (file, from, to, label) => {
  const current = fs.readFileSync(file, 'utf8');
  if (!current.includes(from)) throw new Error(`${label}: expected block missing in ${file}`);
  const next = current.replace(from, to);
  if (next === current) throw new Error(`${label}: replacement made no change in ${file}`);
  fs.writeFileSync(file, next);
  updates.push({ file, label });
};

replace(
  'src/layouts/BaseLayout.astro',
  `          <a class="brand v3-brand-block" href="/" aria-label="Stable or Gone home">\n            <BrandLockup class="site-brand" surface="dark" />\n            <span class="brand-copy v3-brand-copy" aria-hidden="true">\n              <strong>Stablecoin history registry</strong>\n              <small>Evidence, lifecycle, access, and institutional context</small>\n            </span>\n          </a>`,
  `          <div class="brand v3-brand-block">\n            <BrandLockup class="site-brand" surface="dark" href="/" />\n            <span class="brand-copy v3-brand-copy" aria-hidden="true">\n              <strong>Stablecoin history registry</strong>\n              <small>Evidence, lifecycle, access, and institutional context</small>\n            </span>\n          </div>`,
  'remove nested brand anchor'
);

replace(
  'src/styles/public-ui.css',
  `  .masthead-row, .v3-masthead-row { align-items: flex-start; padding-block: 11px; }\n  .brand-copy small, .v3-brand-copy small, .masthead-meta span, .v3-masthead-meta span { display: none; }`,
  `  .masthead-row, .v3-masthead-row { align-items: center; gap: 12px; padding-block: 11px; }\n  .brand-copy, .v3-brand-copy, .masthead-meta span, .v3-masthead-meta span { display: none; }\n  .masthead-meta, .v3-masthead-meta { flex: 0 0 auto; margin-left: auto; }`,
  'fit the CYA masthead inside the mobile shell'
);

replace(
  'scripts/audit-public-typography-enums-direct.mjs',
  `            '.home-section-kicker',\n            '.home-search__popular > span',`,
  `            '.home-section-kicker',\n            '.home-facts dd small',\n            '.home-search__popular > span',`,
  'recognize CYA fact captions as monospaced labels'
);

console.log(JSON.stringify({ ok: true, updates }, null, 2));
