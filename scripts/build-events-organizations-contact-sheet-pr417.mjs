import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'artifacts/pr417-events-organizations');
const manifestPath = path.join(outputRoot, 'manifest.json');
if (!fs.existsSync(manifestPath)) throw new Error('PR #417 visual manifest missing');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.failure_count !== 0 || manifest.capture_count !== 8) throw new Error('PR #417 captures are incomplete or failed');
if (manifest.owner_approval !== false) throw new Error('automated capture may not record owner approval');
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const cards = manifest.records.map((record) => ({ id:record.id, kind:record.kind, route:record.route, viewport:record.viewport, file:record.file, title:record.metrics?.title ?? '', bodyHeight:record.metrics?.bodyHeight ?? null, visibleRows:record.metrics?.visibleRows ?? null, visibleCards:record.metrics?.visibleCards ?? null }));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PR 417 events and organizations review</title><style>:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#071018;color:#edf6f8}body{margin:0;padding:24px}header{max-width:1800px;margin:0 auto 24px}h1{margin:0 0 8px}p{margin:0;color:#a6bac3}.notice{margin-top:14px;padding:12px;border:1px solid #f0cb72;border-radius:8px;color:#ffe6a0}.grid{max-width:1900px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}.card{overflow:hidden;border:1px solid #315164;border-radius:14px;background:#0d1a25}.card h2{margin:0;padding:14px 16px 4px;font-size:17px}.meta{padding:0 16px 14px;color:#a6bac3;font-size:13px}.frame{max-height:900px;overflow:auto;border-top:1px solid #1d3948;background:white}.frame img{display:block;width:100%;height:auto}</style></head><body><header><h1>PR #417 events and organizations</h1><p>Eight required desktop/mobile register and detail states.</p><div class="notice">Automated review artifact only — owner approval remains pending.</div></header><main class="grid">${cards.map((card) => `<article class="card"><h2>${esc(card.id)} · ${esc(card.kind)}</h2><div class="meta">${esc(card.route)} · ${card.viewport.width} × ${card.viewport.height} · ${esc(card.title)} · body ${card.bodyHeight ?? 'unknown'}px · rows ${card.visibleRows ?? 'n/a'} · cards ${card.visibleCards ?? 'n/a'}</div><div class="frame"><img src="${esc(card.file)}" alt="${esc(card.id)} screenshot"></div></article>`).join('')}</main></body></html>\n`;
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), html);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.json'), `${JSON.stringify({ schema_version:'1.0', generated_at:new Date().toISOString(), implementation_pr:417, owner_approval:false, card_count:cards.length, cards }, null, 2)}\n`);
console.log(JSON.stringify({ ok:true, cards:cards.length, owner_approval:false }, null, 2));
