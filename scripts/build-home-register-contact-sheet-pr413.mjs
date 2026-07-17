import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'artifacts/pr413-home-register');
const manifestPath = path.join(outputRoot, 'manifest.json');
if (!fs.existsSync(manifestPath)) throw new Error('PR #413 capture manifest missing');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.failure_count !== 0 || manifest.capture_count !== 10) throw new Error('PR #413 captures are incomplete or failed');
if (manifest.owner_approval !== false) throw new Error('automated capture may not record owner approval');

const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
const cards = manifest.records.map((record) => ({
  device: record.device,
  state: record.state,
  route: record.route,
  viewport: record.viewport,
  file: record.file,
  bodyHeight: record.metrics?.bodyHeight ?? null
}));
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PR 413 home and register review</title><style>
:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#071018;color:#edf6f8}body{margin:0;padding:24px}header{max-width:1500px;margin:0 auto 24px}h1{margin:0 0 8px;font-size:32px}p{margin:0;color:#a6bac3;line-height:1.55}.notice{margin-top:16px;padding:12px 14px;border:1px solid #f0cb72;border-radius:8px;background:#18291f;color:#ffe6a0;font-weight:700}.grid{max-width:1700px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:20px}.card{overflow:hidden;border:1px solid #315164;border-radius:14px;background:#0d1a25;box-shadow:0 18px 50px rgba(0,0,0,.28)}.card h2{margin:0;padding:14px 16px 4px;font-size:17px}.meta{padding:0 16px 14px;color:#a6bac3;font-size:13px}.frame{max-height:820px;overflow:auto;border-top:1px solid #1d3948;background:#fff}.frame img{display:block;width:100%;height:auto}</style></head><body>
<header><h1>PR #413 home and stablecoin register</h1><p>Required desktop and mobile states: default, filtered, no result, and comparison selection.</p><div class="notice">Automated review artifact only — owner approval remains pending.</div></header>
<main class="grid">${cards.map((card) => `<article class="card"><h2>${escape(card.device)} · ${escape(card.state)}</h2><div class="meta">${escape(card.route)} · ${card.viewport.width} × ${card.viewport.height} · body ${card.bodyHeight ?? 'unknown'}px</div><div class="frame"><img src="${escape(card.file)}" alt="${escape(`${card.device} ${card.state} screenshot`)}"></div></article>`).join('')}</main>
</body></html>\n`;
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), html);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.json'), `${JSON.stringify({ schema_version:'1.0', generated_at:new Date().toISOString(), implementation_pr:413, owner_approval:false, card_count:cards.length, cards }, null, 2)}\n`);
console.log(JSON.stringify({ ok:true, cards:cards.length, owner_approval:false, output:'artifacts/pr413-home-register/contact-sheet.html' }, null, 2));
