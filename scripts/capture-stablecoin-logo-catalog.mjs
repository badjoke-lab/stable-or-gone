#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = process.cwd();
const decisionsPath = path.join(root, 'config/stablecoin-logo-decisions.json');
const outputDir = path.join(root, 'artifacts/stablecoin-logo-catalog');
const htmlPath = path.join(outputDir, 'index.html');
const screenshotPath = path.join(outputDir, 'stablecoin-logo-catalog.png');
const reportPath = path.join(outputDir, 'stablecoin-logo-catalog.json');

const ledger = JSON.parse(fs.readFileSync(decisionsPath, 'utf8'));
if (!Array.isArray(ledger.records) || ledger.records.length !== 116) {
  throw new Error(`expected 116 decision records, found ${ledger.records?.length ?? 0}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const cards = [...ledger.records]
  .sort((left, right) => left.slug.localeCompare(right.slug))
  .map((record) => {
    const absoluteAsset = path.join(root, 'public', record.asset_path.replace(/^\//, ''));
    if (!fs.existsSync(absoluteAsset)) throw new Error(`missing asset for ${record.slug}: ${record.asset_path}`);
    const assetUrl = pathToFileURL(absoluteAsset).href;
    return `<article class="mark-card" data-slug="${escapeHtml(record.slug)}" data-mark-type="${escapeHtml(record.mark_type)}">
      <div class="mark-frame"><img src="${escapeHtml(assetUrl)}" alt="" decoding="sync"></div>
      <strong>${escapeHtml(record.name)}</strong>
      <span>${escapeHtml(record.symbol || 'No symbol')}</span>
      <code>${escapeHtml(record.slug)}</code>
      <small>${escapeHtml(record.mark_type)}</small>
    </article>`;
  }).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>SOG Stablecoin logo catalog</title>
<style>
*{box-sizing:border-box}html{background:#f4f1e9;color:#171714;font-family:Arial,sans-serif}body{margin:0;padding:24px}header{padding:0 0 18px;border-bottom:2px solid #171714}h1{margin:0;font:700 34px Georgia,serif}header p{margin:7px 0 0;color:#55534c}.catalog{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));border-top:1px solid #77746b;border-left:1px solid #77746b;margin-top:20px}.mark-card{min-width:0;min-height:210px;padding:13px;display:grid;grid-template-rows:104px auto auto auto auto;align-content:start;gap:5px;border-right:1px solid #77746b;border-bottom:1px solid #77746b;background:#f4f1e9}.mark-frame{width:96px;height:96px;display:grid;place-items:center;border:1px solid #aaa69b;background:#fff;overflow:hidden}.mark-frame img{display:block;width:82px;height:82px;object-fit:contain}.mark-card strong{font-size:14px;line-height:1.25;overflow-wrap:anywhere}.mark-card span{font-size:13px;font-weight:700;color:#075c78}.mark-card code{font-size:11px;line-height:1.25;overflow-wrap:anywhere}.mark-card small{font-size:10px;color:#68665f;overflow-wrap:anywhere}@media(max-width:900px){.catalog{grid-template-columns:repeat(4,minmax(0,1fr))}}
</style></head><body><header><h1>Stable or Gone — all 116 Stablecoin marks</h1><p>Canonical name and symbol are authoritative. Image marks are decorative and classified by source type.</p></header><main class="catalog">${cards}</main></body></html>`;
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
await page.waitForFunction(() => [...document.images].every((image) => image.complete));
const metrics = await page.evaluate(() => {
  const images = [...document.images];
  return {
    cards: document.querySelectorAll('.mark-card').length,
    images: images.length,
    broken_images: images.filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0).map((image) => image.closest('[data-slug]')?.getAttribute('data-slug') ?? image.src),
    empty_frames: [...document.querySelectorAll('.mark-frame')].filter((frame) => !frame.querySelector('img')).map((frame) => frame.closest('[data-slug]')?.getAttribute('data-slug')),
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
if (metrics.cards !== 116) failures.push(`expected 116 cards, found ${metrics.cards}`);
if (metrics.images !== 116) failures.push(`expected 116 images, found ${metrics.images}`);
if (metrics.broken_images.length) failures.push(`broken images: ${metrics.broken_images.join(', ')}`);
if (metrics.empty_frames.length) failures.push(`empty frames: ${metrics.empty_frames.join(', ')}`);
const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  screenshot: path.relative(root, screenshotPath),
  ...metrics,
  failures
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
