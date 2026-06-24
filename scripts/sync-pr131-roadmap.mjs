import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';

const path = 'docs/roadmap.md';
let text = readFileSync(path, 'utf8');

const replacements = [
  [
    'PR #129 — Add dated Guides framework and GENIUS Act guide\nMerge: 7cc7a2fe2465b56f5d9dfd1e422ad1f6292af076',
    'PR #130 — Add MiCA and Stablecoins guide\nMerge: 3482b53fb24ec9160480531bd010d0ce9ee127c0'
  ],
  [
    'PR #130 — MiCA and Stablecoins guide\nStatus: in review\nInformation current through: 2026-06-25\nNext planned work after PR #130: JPYC versus JPYSC comparison',
    'PR #131 — JPYC versus JPYSC comparison\nStatus: in review\nInformation current through: 2026-06-25\nNext planned work after PR #131: site-wide guide integration'
  ],
  [
    'PR #130 — Add MiCA and Stablecoins guide\n```',
    'PR #130 — Add MiCA and Stablecoins guide\nPR #131 — Add JPYC versus JPYSC comparison guide\n```'
  ],
  [
    'PR #129 — Guides framework + GENIUS Act — merged\nPR #130 — MiCA — in review\nPR #131 — JPYC versus JPYSC\nPR #132 — Site-wide guide integration',
    'PR #129 — Guides framework + GENIUS Act — merged\nPR #130 — MiCA — merged\nPR #131 — JPYC versus JPYSC — in review\nPR #132 — Site-wide guide integration'
  ],
  [
    '2. Complete and merge PR #130 with the MiCA guide, primary-source links, representative asset comparisons, and roadmap update.\n3. Add the JPYC versus JPYSC comparison next; keep JPYC Prepaid and JPYSC legally and operationally separate.\n4. Finish with the site-wide integration PR covering homepage discovery, related guides, Updates, metadata, sitemap, and validation.\n5. Keep article publication dates unset until the pages are actually live in production.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.',
    '2. Complete and merge PR #131 with the JPYC versus JPYSC comparison, primary-source links, and explicit JPYC Prepaid separation.\n3. Finish with PR #132 covering homepage discovery, related guides, Updates, metadata, sitemap, and guide validation.\n4. Keep article publication dates unset until the pages are actually live in production.\n5. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.'
  ]
];

for (const [from, to] of replacements) {
  if (!text.includes(from)) throw new Error(`Roadmap sync target not found: ${from.slice(0, 80)}`);
  text = text.replace(from, to);
}

writeFileSync(path, text);
for (const file of ['scripts/sync-pr131-roadmap.mjs', '.github/workflows/sync-pr131-roadmap.yml']) {
  if (existsSync(file)) unlinkSync(file);
}
