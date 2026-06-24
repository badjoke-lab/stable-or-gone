import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';

const path = 'docs/roadmap.md';
let text = readFileSync(path, 'utf8');

const replacements = [
  [
    'PR #128 — Add JPYSC and Japan stablecoin events\nMerge: 6ce8b9770eae75b5d0b23490a55c653fc551625c',
    'PR #129 — Add dated Guides framework and GENIUS Act guide\nMerge: 7cc7a2fe2465b56f5d9dfd1e422ad1f6292af076'
  ],
  [
    'PR #129 — Dated Guides framework and GENIUS Act guide\nStatus: in review\nInformation current through: 2026-06-25\nNext planned work after PR #129: MiCA guide',
    'PR #130 — MiCA and Stablecoins guide\nStatus: in review\nInformation current through: 2026-06-25\nNext planned work after PR #130: JPYC versus JPYSC comparison'
  ],
  [
    'PR #129 — Add dated Guides framework and GENIUS Act guide\n```',
    'PR #129 — Add dated Guides framework and GENIUS Act guide\nPR #130 — Add MiCA and Stablecoins guide\n```'
  ],
  [
    'PR #129 — Guides framework + GENIUS Act\nPR #130 — MiCA\nPR #131 — JPYC versus JPYSC\nPR #132 — Site-wide guide integration',
    'PR #129 — Guides framework + GENIUS Act — merged\nPR #130 — MiCA — in review\nPR #131 — JPYC versus JPYSC\nPR #132 — Site-wide guide integration'
  ],
  [
    '2. Complete and merge PR #129 with the dated guide catalog, shared article components, restructured Guides index, and GENIUS Act guide.\n3. Add the MiCA guide next, separating issuer authorization, token status, and CASP availability.\n4. Add the JPYC versus JPYSC guide after MiCA; keep RLUSD outside that comparison.\n5. Finish with the site-wide integration PR covering homepage discovery, related guides, Updates, metadata, sitemap, and validation.\n6. Keep article publication dates unset until the pages are actually live in production.\n7. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.',
    '2. Complete and merge PR #130 with the MiCA guide, primary-source links, representative asset comparisons, and roadmap update.\n3. Add the JPYC versus JPYSC comparison next; keep JPYC Prepaid and JPYSC legally and operationally separate.\n4. Finish with the site-wide integration PR covering homepage discovery, related guides, Updates, metadata, sitemap, and validation.\n5. Keep article publication dates unset until the pages are actually live in production.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.'
  ]
];

for (const [from, to] of replacements) {
  if (!text.includes(from)) throw new Error(`Roadmap sync target not found: ${from.slice(0, 80)}`);
  text = text.replace(from, to);
}

writeFileSync(path, text);
for (const file of ['scripts/sync-pr130-roadmap.mjs', '.github/workflows/sync-pr130-roadmap.yml']) {
  if (existsSync(file)) unlinkSync(file);
}
