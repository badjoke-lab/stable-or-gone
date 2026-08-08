#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = process.cwd();
const decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');
const decisionAdditionsPath = path.join(root, 'config/stablecoin-logo-decisions-additions.json');
const displayPolicyPath = path.join(root, 'config/stablecoin-logo-display-policy.json');
const outputDir = path.join(root, 'artifacts/stablecoin-logo-catalog');
const htmlPath = path.join(outputDir, 'index.html');
const screenshotPath = path.join(outputDir, 'stablecoin-logo-catalog.png');
const reportPath = path.join(outputDir, 'stablecoin-logo-catalog.json');

const ledger = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
const additions = fs.existsSync(decisionAdditionsPath)
  ? JSON.parse(fs.readFileSync(decisionAdditionsPath, 'utf8'))
  : { records: [] };
const decisionRecords = [...(ledger.records ?? []), ...(additions.records ?? [])];
const displayPolicy = JSON.parse(fs.readFileSync(displayPolicyPath, 'utf8'));
const fallbackSlugs = new Set(displayPolicy.neutral_fallback_slugs ?? []);
const expectedCanonicalRecords = Number(displayPolicy.canonical_records);
if (decisionRecords.length !== expectedCanonicalRecords) {
  throw new Error(`expected ${expectedCanonicalRecords} decision records, found ${decisionRecords.length}`);
}
if (new Set(decisionRecords.map((record) => record.slug)).size !== expectedCanonicalRecords) {
  throw new Error('decision records contain duplicate slugs');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');
const fallbackText = (record) => String(record.symbol || record.name || '?').replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase() || '?';

const cards = [...decisionRecords]
  .sort((left, right) => left.slug.localeCompare(right.slug))
  .map((record) => {
    const isFallback = fallbackSlugs.has(record.slug);
    let mark;
    if (isFallback) {
      mark = `<span class="neutral-fallback" aria-hidden="true">${escapeHtml(fallbackText(record))}</span>`;
    } else {
      const absoluteAsset = path.join(root, 'public', record.asset_path.replace(/^\//, ''));
      if (!fs.existsSync(absoluteAsset)) throw new Error(`missing asset for ${record.slug}: ${record.asset_path}`);
      mark = `<img src="${escapeHtml(pathToFileURL(absoluteAsset).href)}" alt="" decoding="sync">`;
    }
    return `<article class="mark-card" data-slug="${escapeHtml(record.slug)}" data-display-kind="${isFallback ? 'fallback' : 'logo'}" data-mark-type="${escapeHtml(record.mark_type)}">
      <div class="mark-frame">${mark}</div>
      <strong>${escapeHtml(record.name)}</strong>
      <span>${escapeHtml(record.symbol || 'No symbol')}</span>
      <code>${escapeHtml(record.slug)}</code>
      <small>${isFallback ? `neutral fallback · ${escapeHtml(record.mark_type)}` : escapeHtml(record.mark_type)}</small>
    </article>`;
  }).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SOG Stablecoin mark catalog</title>
<style>
*{box-sizing:border-box}html{background:#f4f1e9;color:#171714;font-family:Arial,sans-serif}body{margin:0;padding:24px}header{padding:0 0 18px;border-bottom:2px solid #171714}h1{margin:0;font:700 34px Georgia,serif}header p{margin:7px 0 0;color:#55534c}.catalog{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));border-top:1px solid #77746b;border-left:1px solid #77746b;margin-top:20px}.mark-card{min-width:0;min-height:210px;padding:13px;display:grid;grid-template-rows:104px auto auto auto auto;align-content:start;gap:5px;border-right:1px solid #77746b;border-bottom:1px solid #77746b;background:#f4f1e9}.mark-frame{width:96px;height:96px;display:grid;place-items:center;border:1px solid #aaa69b;background:#fff;overflow:hidden}.mark-frame img{display:block;width:82px;height:82px;object-fit:contain}.neutral-fallback{width:82px;height:82px;border:1px solid #77746b;border-radius:50%;display:grid;place-items:center;background:#ece8de;color:#55534c;font-size:24px;font-weight:700;letter-spacing:.04em}.mark-card strong{font-size:14px;line-height:1.25;overflow-wrap:anywhere}.mark-card>span:not(.neutral-fallback){font-size:13px;font-weight:700;color:#075c78}.mark-card code{font-size:11px;line-height:1.25;overflow-wrap:anywhere}.mark-card small{font-size:10px;color:#68665f;overflow-wrap:anywhere}@media(max-width:900px){.catalog{grid-template-columns:repeat(4,minmax(0,1fr))}}
</style></head><body><header><h1>Stable or Gone — ${displayPolicy.direct_logo_records} direct logos, ${displayPolicy.neutral_fallback_records} neutral fallbacks</h1><p>Only Stablecoin- or product-specific marks render as logos. Issuer, project, and directory-only marks remain research evidence.</p></header><main class="catalog">${cards}</main></body></html>`;
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.waitForFunction(() => [...document.images].every((image) => image.complete));
const metrics = await page.evaluate(() => {
  const images = [...document.images];
  return {
    cards: document.querySelectorAll('.mark-card').length,
    logos: document.querySelectorAll('[data-display-kind="logo"]').length,
    fallbacks: document.querySelectorAll('[data-display-kind="fallback"]').length,
    images: images.length,
    broken_images: images.filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0).map((image) => image.closest('[data-slug]')?.getAttribute('data-slug') ?? image.src),
    empty_frames: [...document.querySelectorAll('.mark-frame')].filter((frame) => !frame.querySelector('img,.neutral-fallback')).map((frame) => frame.closest('[data-slug]')?.getAttribute('data-slug')),
    mark_types: [...document.querySelectorAll('[data-mark-type]')].reduce((counts, element) => {
      const type = element.getAttribute('data-mark-type') ?? 'unknown';
      counts[type] = (counts[type] ?? 0) + 1;
      return counts;
    }, {})
  };
});
await page.screenshot({ path: screenshotPath, fullPage: true });
await browser.close();

const failures = [];
const expectedCards = Number(displayPolicy.canonical_records);
const expectedLogos = Number(displayPolicy.direct_logo_records);
const expectedFallbacks = Number(displayPolicy.neutral_fallback_records);
if (metrics.cards !== expectedCards) failures.push(`expected ${expectedCards} cards, found ${metrics.cards}`);
if (metrics.logos !== expectedLogos) failures.push(`expected ${expectedLogos} direct logos, found ${metrics.logos}`);
if (metrics.fallbacks !== expectedFallbacks) failures.push(`expected ${expectedFallbacks} neutral fallbacks, found ${metrics.fallbacks}`);
if (metrics.images !== expectedLogos) failures.push(`expected ${expectedLogos} images, found ${metrics.images}`);
if (metrics.broken_images.length) failures.push(`broken images: ${metrics.broken_images.join(', ')}`);
if (metrics.empty_frames.length) failures.push(`empty frames: ${metrics.empty_frames.join(', ')}`);
const report = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  screenshot: path.relative(root, screenshotPath),
  decision_additions: additions.records?.length ?? 0,
  ...metrics,
  failures
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
