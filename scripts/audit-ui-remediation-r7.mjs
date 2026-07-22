import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.UI_AUDIT_BASE_URL || 'http://127.0.0.1:4321';
const outputRoot = process.env.UI_AUDIT_OUTPUT || 'artifacts/ui-remediation-r7';
const routes = [
  ['home', '/'],
  ['guide-article', '/guides/what-is-a-depeg/'],
  ['dossier-usdc', '/stablecoin/usdc/'],
  ['about', '/about/'],
  ['contact', '/contact/'],
  ['support', '/support/'],
  ['glossary', '/glossary/'],
  ['models', '/models/'],
  ['updates', '/updates/'],
  ['maintenance', '/maintenance/']
];
const viewports = [
  ['desktop-1440', 1440, 900],
  ['desktop-1280', 1280, 800],
  ['tablet-768', 768, 1024],
  ['mobile-390', 390, 844],
  ['mobile-320', 320, 568]
];

fs.mkdirSync(outputRoot, { recursive: true });
const browser = await chromium.launch({ headless: true });
const manifest = { schema_version: '1.1', base_url: baseUrl, captures: [], failures: [] };
const forbiddenFont = /(georgia|cambria|times new roman|\bserif\b)/i;
const monospaceFont = /(menlo|monaco|consolas|sfmono|liberation mono|\bmonospace\b)/i;

for (const [viewportName, width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  for (const [routeName, route] of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts?.ready);
    const diagnostics = await page.evaluate(({ width }) => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const technical = (element) => element.matches('code,pre,kbd,samp,.contract-address,.transaction-hash,[data-long-value],.r7-wallet-row code,.address-block code,.stablecoin-record-id');
      const textSelector = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,th,td,label,button,input,select,textarea,summary,a,span,strong,small,time,i,em,blockquote';
      const fontIssues = [];
      for (const element of document.querySelectorAll(textSelector)) {
        if (!isVisible(element)) continue;
        const family = getComputedStyle(element).fontFamily;
        if (/(georgia|cambria|times new roman|\bserif\b)/i.test(family)) fontIssues.push({ selector: element.tagName.toLowerCase(), family, text: element.textContent?.trim().slice(0, 80) });
        if (/(menlo|monaco|consolas|sfmono|liberation mono|\bmonospace\b)/i.test(family) && !technical(element)) fontIssues.push({ selector: element.tagName.toLowerCase(), family, text: element.textContent?.trim().slice(0, 80) });
      }
      const flatSelectors = '.site-header,.site-search-control,.mobile-navigation-panel,.r7-masthead,.r7-disclosure,.r7-primary-action,.r7-letter-nav a,.r7-maintenance-status';
      const flatIssues = [];
      for (const element of document.querySelectorAll(flatSelectors)) {
        if (!isVisible(element)) continue;
        const style = getComputedStyle(element);
        const radius = [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius];
        if (radius.some((value) => parseFloat(value) > 0)) flatIssues.push({ selector: element.className || element.tagName, property: 'border-radius', value: radius.join(' ') });
        if (style.boxShadow !== 'none') flatIssues.push({ selector: element.className || element.tagName, property: 'box-shadow', value: style.boxShadow });
        if (style.backgroundImage !== 'none') flatIssues.push({ selector: element.className || element.tagName, property: 'background-image', value: style.backgroundImage });
        if (style.backdropFilter && style.backdropFilter !== 'none') flatIssues.push({ selector: element.className || element.tagName, property: 'backdrop-filter', value: style.backdropFilter });
      }
      return {
        title: document.title,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: width,
        bodyFont: getComputedStyle(document.body).fontFamily,
        bodyBackgroundImage: getComputedStyle(document.body).backgroundImage,
        fontIssues: fontIssues.slice(0, 100),
        flatIssues: flatIssues.slice(0, 100)
      };
    }, { width });

    const failures = [];
    if (!response?.ok()) failures.push(`HTTP ${response?.status() ?? 'no response'}`);
    if (forbiddenFont.test(diagnostics.bodyFont)) failures.push(`body serif font: ${diagnostics.bodyFont}`);
    if (monospaceFont.test(diagnostics.bodyFont)) failures.push(`body monospace font: ${diagnostics.bodyFont}`);
    if (diagnostics.bodyBackgroundImage !== 'none') failures.push(`body decorative background: ${diagnostics.bodyBackgroundImage}`);
    if (diagnostics.documentWidth > width + 1) failures.push(`horizontal overflow ${diagnostics.documentWidth}px > ${width}px`);
    if (diagnostics.fontIssues.length) failures.push(`${diagnostics.fontIssues.length} visible typography violations`);
    if (diagnostics.flatIssues.length) failures.push(`${diagnostics.flatIssues.length} visible flatness violations`);
    if (consoleErrors.length) failures.push(`${consoleErrors.length} console errors`);
    if (failedRequests.length) failures.push(`${failedRequests.length} failed requests`);

    const directory = path.join(outputRoot, viewportName);
    fs.mkdirSync(directory, { recursive: true });
    const screenshot = path.join(directory, `${routeName}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    const capture = { viewport: viewportName, width, height, route_name: routeName, route, screenshot, diagnostics, console_errors: consoleErrors, failed_requests: failedRequests, failures };
    manifest.captures.push(capture);
    if (failures.length) manifest.failures.push(capture);
    await page.close();
  }
  await context.close();
}

await browser.close();
manifest.ok = manifest.failures.length === 0;
manifest.summary = { captures: manifest.captures.length, passed: manifest.captures.length - manifest.failures.length, failed: manifest.failures.length };
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.summary, null, 2));
if (!manifest.ok) process.exit(1);
