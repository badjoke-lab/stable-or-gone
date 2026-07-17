import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'artifacts/pr421-full-visual-closure');
const manifestPath = path.join(outputRoot, 'manifest.json');
if (!fs.existsSync(manifestPath)) throw new Error('PR #421 closure manifest missing');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const approvalRegister = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/ui-v3-visual-approval-register.json'), 'utf8'));
if (manifest.failure_count !== 0 || manifest.capture_count !== 14) throw new Error('PR #421 closure captures are incomplete or failed');
if (manifest.owner_approval !== false || manifest.accepted_desktop !== 0 || manifest.accepted_mobile !== 0) throw new Error('automated closure may not record owner approval');

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
const templateGroups = approvalRegister.required_templates.map((template) => {
  const states = manifest.records.filter((record) => record.template === template.template);
  return {
    template: template.template,
    desktop_status: template.desktop_status,
    mobile_status: template.mobile_status,
    reviewed_by: template.reviewed_by,
    reviewed_at: template.reviewed_at,
    notes: template.notes,
    states: states.map((state) => ({ id:state.id, route:state.route, state:state.state, device:state.device, viewport:state.viewport, file:state.file, automated_gate:state.automated_gate, owner_status:'pending', owner_decision:'', owner_notes:'' }))
  };
});
const ownerReview = {
  schema_version:'1.0',
  generated_at:new Date().toISOString(),
  implementation_pr:421,
  phase:'PR G',
  status:'awaiting_owner_review',
  automated_capture_counts_as_approval:false,
  ui_completion:false,
  current_counts:approvalRegister.current_counts,
  completion_rule:approvalRegister.completion_rule,
  templates:templateGroups
};
fs.writeFileSync(path.join(outputRoot, 'owner-review.json'), `${JSON.stringify(ownerReview, null, 2)}\n`);

const cards = manifest.records.map((record) => ({ id:record.id, template:record.template, route:record.route, state:record.state, device:record.device, viewport:record.viewport, file:record.file, bodyHeight:record.metrics.bodyHeight, h1FontSize:record.metrics.h1FontSize, ownerStatus:'pending' }));
const contactHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PR 421 full visual closure</title><style>:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#071018;color:#edf6f8}body{margin:0;padding:24px}header{max-width:1900px;margin:0 auto 24px}h1{margin:0 0 8px}.notice{margin-top:14px;padding:12px 14px;border:1px solid #f0cb72;border-radius:8px;color:#ffe6a0}.grid{max-width:1900px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:20px}.card{overflow:hidden;border:1px solid #315164;border-radius:14px;background:#0d1a25}.card h2{margin:0;padding:14px 16px 4px;font-size:17px}.meta{padding:0 16px 14px;color:#a6bac3;font-size:13px;line-height:1.5}.frame{max-height:900px;overflow:auto;border-top:1px solid #1d3948;background:white}.frame img{display:block;width:100%;height:auto}</style></head><body><header><h1>PR #421 full visual closure</h1><p>Fourteen design-contract states. Automated gates passed; owner approval remains pending.</p><div class="notice">Screenshots are review evidence only. They do not approve a template or complete UI v3.</div></header><main class="grid">${cards.map((card) => `<article class="card"><h2>${esc(card.id)} · ${esc(card.template)}</h2><div class="meta">${esc(card.route)} · ${esc(card.state)} · ${card.viewport.width} × ${card.viewport.height} · body ${card.bodyHeight}px · H1 ${card.h1FontSize}px · owner ${card.ownerStatus}</div><div class="frame"><img src="${esc(card.file)}" alt="${esc(card.id)} screenshot"></div></article>`).join('')}</main></body></html>\n`;
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), contactHtml);
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.json'), `${JSON.stringify({ schema_version:'1.0', generated_at:new Date().toISOString(), implementation_pr:421, owner_approval:false, card_count:cards.length, cards }, null, 2)}\n`);

const reviewHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PR 421 owner review</title><style>:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#071018;color:#edf6f8}body{margin:0;padding:24px;line-height:1.55}main,header{max-width:1500px;margin:auto}header{margin-bottom:24px}.notice{padding:14px;border:1px solid #f0cb72;border-radius:10px;color:#ffe6a0}section{margin:18px 0;padding:18px;border:1px solid #315164;border-radius:14px;background:#0d1a25}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #315164;text-align:left;vertical-align:top}th{color:#a6bac3}code{overflow-wrap:anywhere}.pending{color:#ffe6a0}.decision{min-width:140px;border:1px dashed #66808d;padding:8px;border-radius:6px}</style></head><body><header><h1>UI v3 owner review worksheet</h1><p>Review every required state before recording acceptance or rejection in the visual approval register.</p><div class="notice">Current state: AWAITING OWNER REVIEW. Automated capture is not approval. All generated decisions below remain blank.</div></header><main>${templateGroups.map((group) => `<section><h2>${esc(group.template)}</h2><p>Desktop: <span class="pending">${esc(group.desktop_status)}</span> · Mobile: <span class="pending">${esc(group.mobile_status)}</span></p><table><thead><tr><th>State</th><th>Route / viewport</th><th>Artifact</th><th>Gate</th><th>Owner decision</th><th>Owner notes</th></tr></thead><tbody>${group.states.map((state) => `<tr><td>${esc(state.id)}<br><small>${esc(state.state)}</small></td><td><code>${esc(state.route)}</code><br>${state.viewport.width} × ${state.viewport.height}</td><td><a href="${esc(state.file)}">${esc(state.file)}</a></td><td>${esc(state.automated_gate)}</td><td><div class="decision">accepted / rejected</div></td><td><div class="decision">notes</div></td></tr>`).join('')}</tbody></table></section>`).join('')}</main></body></html>\n`;
fs.writeFileSync(path.join(outputRoot, 'owner-review.html'), reviewHtml);
console.log(JSON.stringify({ ok:true, contact_cards:cards.length, templates:templateGroups.length, owner_approval:false, status:'AWAITING OWNER REVIEW' }, null, 2));
