import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.resolve('artifacts/ui-remediation-r2');
const viewports = [
  { id: 'desktop-1440', width: 1440, height: 900, headerMax: 72, h1Max: 48 },
  { id: 'desktop-1280', width: 1280, height: 800, headerMax: 72, h1Max: 48 },
  { id: 'tablet-768', width: 768, height: 1024, headerMax: 68, h1Max: 40 },
  { id: 'mobile-390', width: 390, height: 844, headerMax: 64, h1Max: 36 },
  { id: 'mobile-320', width: 320, height: 568, headerMax: 64, h1Max: 36 }
];
const routes = [
  { id: 'home', pathname: '/' },
  { id: 'stablecoins', pathname: '/stablecoins/' },
  { id: 'usdc-dossier', pathname: '/stablecoin/usdc/' },
  { id: 'events', pathname: '/events/' },
  { id: 'organizations', pathname: '/issuers/' },
  { id: 'guides', pathname: '/guides/' },
  { id: 'methodology', pathname: '/methodology/' }
];
const forbiddenReadyText = ['failed to load', 'contract mismatch', 'index unavailable'];
const technicalTags = new Set(['CODE', 'PRE', 'KBD', 'SAMP']);

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const browser = await chromium.launch({ headless: true });
const records = [];
const failures = [];

for (const viewport of viewports) {
  const viewportDir = path.join(outputRoot, viewport.id);
  fs.mkdirSync(viewportDir, { recursive: true });

  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const failedResponses = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(String(error?.message || error)));
    page.on('requestfailed', (request) => {
      if (['document', 'stylesheet', 'script', 'xhr', 'fetch'].includes(request.resourceType())) {
        failedRequests.push(`${request.resourceType()} ${request.url()} ${request.failure()?.errorText || ''}`.trim());
      }
    });
    page.on('response', (response) => {
      if (response.status() >= 400 && ['document', 'stylesheet', 'script', 'xhr', 'fetch'].includes(response.request().resourceType())) {
        failedResponses.push(`${response.status()} ${response.request().resourceType()} ${response.url()}`);
      }
    });

    const url = `${baseUrl}${route.pathname}`;
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
    await page.waitForTimeout(250);

    const audit = await page.evaluate(({ forbiddenReadyText, technicalTags }) => {
      const visible = (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const px = (value) => Number.parseFloat(String(value || '0')) || 0;
      const root = document.documentElement;
      const body = document.body;
      const header = document.querySelector('.site-header');
      const h1 = document.querySelector('h1');
      const bodyStyle = window.getComputedStyle(body);
      const h1Style = h1 ? window.getComputedStyle(h1) : null;
      const pageText = body.innerText.toLocaleLowerCase();
      const forbiddenText = forbiddenReadyText.filter((needle) => pageText.includes(needle));
      const breakAll = [...document.querySelectorAll('body *')]
        .filter((element) => visible(element))
        .filter((element) => !technicalTags.includes(element.tagName))
        .filter((element) => !element.closest('code,pre,kbd,samp,[data-long-value],.contract-address,.transaction-hash'))
        .filter((element) => window.getComputedStyle(element).wordBreak === 'break-all')
        .slice(0, 20)
        .map((element) => `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).trim().replace(/\s+/g, '.')}` : ''}`);
      const clippedText = [...document.querySelectorAll('h1,h2,h3,p,a,button,label,th,td,dt,dd')]
        .filter((element) => visible(element))
        .filter((element) => element.scrollWidth > element.clientWidth + 2 && window.getComputedStyle(element).overflowX === 'hidden')
        .slice(0, 20)
        .map((element) => `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).trim().replace(/\s+/g, '.')}` : ''}`);
      const tableFontSizes = [...document.querySelectorAll('table th, table td')]
        .filter((element) => visible(element))
        .map((element) => px(window.getComputedStyle(element).fontSize));
      return {
        title: document.title,
        bodyFontFamily: bodyStyle.fontFamily,
        bodyFontSize: px(bodyStyle.fontSize),
        viewportWidth: window.innerWidth,
        scrollWidth: Math.max(root.scrollWidth, body.scrollWidth),
        pageHeight: Math.max(root.scrollHeight, body.scrollHeight),
        headerHeight: header ? header.getBoundingClientRect().height : 0,
        h1Text: h1?.textContent?.trim() || '',
        h1FontSize: h1Style ? px(h1Style.fontSize) : 0,
        h1WordBreak: h1Style?.wordBreak || '',
        forbiddenText,
        breakAll,
        clippedText,
        minimumTableFontSize: tableFontSizes.length ? Math.min(...tableFontSizes) : null
      };
    }, { forbiddenReadyText, technicalTags: [...technicalTags] });

    const screenshot = path.join(viewportDir, `${route.id}.png`);
    await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });

    const recordFailures = [];
    if (!response || !response.ok()) recordFailures.push(`document response was ${response?.status() ?? 'missing'}`);
    if (consoleErrors.length) recordFailures.push(`console errors: ${consoleErrors.join(' | ')}`);
    if (pageErrors.length) recordFailures.push(`page errors: ${pageErrors.join(' | ')}`);
    if (failedRequests.length) recordFailures.push(`failed requests: ${failedRequests.join(' | ')}`);
    if (failedResponses.length) recordFailures.push(`failed responses: ${failedResponses.join(' | ')}`);
    if (audit.scrollWidth > audit.viewportWidth + 1) recordFailures.push(`horizontal page overflow ${audit.scrollWidth}px > ${audit.viewportWidth}px`);
    if (audit.headerHeight > viewport.headerMax) recordFailures.push(`header ${audit.headerHeight}px exceeds ${viewport.headerMax}px`);
    if (!audit.h1Text) recordFailures.push('missing visible H1');
    if (audit.h1FontSize > viewport.h1Max + 0.25) recordFailures.push(`H1 ${audit.h1FontSize}px exceeds ${viewport.h1Max}px`);
    if (audit.h1WordBreak === 'break-all') recordFailures.push('H1 uses word-break: break-all');
    if (audit.bodyFontSize < 16) recordFailures.push(`body font ${audit.bodyFontSize}px is below 16px`);
    if (/mono|menlo|consolas|courier/i.test(audit.bodyFontFamily)) recordFailures.push(`body font is monospace: ${audit.bodyFontFamily}`);
    if (audit.forbiddenText.length) recordFailures.push(`visible runtime error text: ${audit.forbiddenText.join(', ')}`);
    if (audit.breakAll.length) recordFailures.push(`ordinary break-all elements: ${audit.breakAll.join(', ')}`);
    if (audit.clippedText.length) recordFailures.push(`clipped text elements: ${audit.clippedText.join(', ')}`);
    if (audit.minimumTableFontSize !== null && audit.minimumTableFontSize < 14) recordFailures.push(`table font ${audit.minimumTableFontSize}px is below 14px`);

    const record = {
      viewport: viewport.id,
      route: route.pathname,
      screenshot: path.relative(outputRoot, screenshot),
      ...audit,
      consoleErrors,
      pageErrors,
      failedRequests,
      failedResponses,
      failures: recordFailures
    };
    records.push(record);
    for (const failure of recordFailures) failures.push(`${viewport.id} ${route.pathname}: ${failure}`);
    await page.close();
  }
}

await browser.close();

const manifest = {
  schemaVersion: '1.0',
  authority: 'docs/ui-v3-remediation-authority.md',
  phase: 'R2',
  createdAt: new Date().toISOString(),
  baseUrl,
  captureCount: records.length,
  failureCount: failures.length,
  failures,
  records
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const cards = records.map((record) => `
  <article class="card ${record.failures.length ? 'failed' : ''}">
    <header><strong>${escapeHtml(record.viewport)} · ${escapeHtml(record.route)}</strong><span>${record.pageHeight}px</span></header>
    <img src="${escapeHtml(record.screenshot)}" alt="${escapeHtml(`${record.viewport} ${record.route}`)}" loading="lazy">
    ${record.failures.length ? `<pre>${escapeHtml(record.failures.join('\n'))}</pre>` : '<p>Pass</p>'}
  </article>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>R2 shell audit</title><style>body{margin:0;padding:24px;background:#071018;color:#edf6f8;font:14px system-ui,sans-serif}.summary{margin-bottom:20px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}.card{border:1px solid #315164;background:#0d1a25;padding:12px}.card.failed{border-color:#ff9696}.card header{display:flex;justify-content:space-between;gap:12px;margin-bottom:10px}.card img{display:block;width:100%;height:auto;background:white}.card p{color:#7ee0b1}.card pre{white-space:pre-wrap;color:#ffb0b0;font-size:12px}</style></head><body><section class="summary"><h1>UI remediation R2 shell audit</h1><p>${records.length} captures · ${failures.length} failures · automated capture is not owner approval.</p></section><main class="grid">${cards}</main></body></html>`;
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), html);

if (failures.length) {
  console.error('UI remediation R2 audit failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, captureCount: records.length, failureCount: 0, outputRoot }, null, 2));
