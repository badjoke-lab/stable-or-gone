import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const artifactRoot = path.join(root, 'artifacts/screenshots');
const devices = ['desktop', 'mobile'];
const preferredRoutes = ['/', '/stablecoins/', '/compare/', '/events/', '/issuers/', '/guides/', '/updates/', '/about/'];
const manifests = devices.map((device) => {
  const file = path.join(artifactRoot, `manifest.${device}.json`);
  if (!fs.existsSync(file)) throw new Error(`${device} screenshot manifest missing`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
});

const cards = [];
for (const manifest of manifests) {
  if (manifest.failed_count !== 0) throw new Error(`${manifest.device} screenshot capture contains failures`);
  const byRoute = new Map((manifest.records ?? []).map((record) => [record.path, record]));
  for (const route of preferredRoutes) {
    const record = byRoute.get(route);
    if (!record) continue;
    const relativeImage = path.relative(artifactRoot, path.join(root, record.file)).replaceAll(path.sep, '/');
    cards.push({
      device: manifest.device,
      route,
      image: relativeImage,
      viewport: manifest.viewport,
      body_height: record.metrics?.bodyHeight ?? null,
      horizontal_overflow: Boolean(record.metrics?.horizontalOverflow)
    });
  }
}

if (cards.length < 8) throw new Error(`shell contact sheet requires at least eight captures, found ${cards.length}`);
if (cards.some((card) => card.horizontal_overflow)) throw new Error('shell contact sheet contains a horizontally overflowing capture');

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PR 411 shell contact sheet</title>
<style>
:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#071018;color:#edf6f8}body{margin:0;padding:24px}header{max-width:1200px;margin:0 auto 24px}h1{margin:0 0 8px;font-size:32px}p{margin:0;color:#a6bac3;line-height:1.55}.notice{margin-top:16px;padding:12px 14px;border:1px solid #f0cb72;background:#18291f;color:#ffe6a0;font-weight:700}.grid{max-width:1600px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}.card{overflow:hidden;border:1px solid #315164;border-radius:14px;background:#0d1a25;box-shadow:0 18px 50px rgba(0,0,0,.28)}.card h2{margin:0;padding:14px 16px 4px;font-size:17px}.meta{padding:0 16px 14px;color:#a6bac3;font-size:13px}.frame{max-height:760px;overflow:auto;border-top:1px solid #1d3948;background:#fff}.frame img{display:block;width:100%;height:auto}</style>
</head>
<body>
<header><h1>PR #411 global shell contact sheet</h1><p>Desktop and mobile captures of the shared evidence-registry shell. Routes and page templates are unchanged.</p><div class="notice">Automated capture only — this artifact does not record owner approval.</div></header>
<main class="grid">
${cards.map((card) => `<article class="card"><h2>${escape(card.device)} · ${escape(card.route)}</h2><div class="meta">${card.viewport.width} × ${card.viewport.height} · body ${card.body_height ?? 'unknown'}px</div><div class="frame"><img src="${escape(card.image)}" alt="${escape(`${card.device} screenshot of ${card.route}`)}"></div></article>`).join('\n')}
</main>
</body>
</html>\n`;

fs.mkdirSync(artifactRoot, { recursive: true });
fs.writeFileSync(path.join(artifactRoot, 'shell-contact-sheet-pr411.html'), html);
fs.writeFileSync(path.join(artifactRoot, 'shell-contact-sheet-pr411.json'), `${JSON.stringify({ schema_version:'1.0', generated_at:new Date().toISOString(), owner_approval:false, cards }, null, 2)}\n`);
console.log(JSON.stringify({ ok:true, cards:cards.length, owner_approval:false, output:'artifacts/screenshots/shell-contact-sheet-pr411.html' }, null, 2));
