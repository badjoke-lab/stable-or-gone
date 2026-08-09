import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173';
const outputDir = path.resolve('artifacts/stablecoin-compare-matrix');
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--disable-lcd-text'] });
const results = [];
const failures = [];

try {
  for (const device of [
    { name: 'desktop', context: { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' } },
    { name: 'mobile', context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' } }
  ]) {
    const context = await browser.newContext(device.context);
    const page = await context.newPage();
    await page.goto(`${baseUrl}/stablecoins/`, { waitUntil: 'networkidle' });
    const state = await page.evaluate(() => {
      const panel = document.querySelector('[data-comparison-panel]');
      if (!(panel instanceof HTMLElement)) return { panelFound: false };
      const style = getComputedStyle(panel);
      const rect = panel.getBoundingClientRect();
      return {
        panelFound: true,
        hiddenAttribute: panel.hasAttribute('hidden'),
        display: style.display,
        visibleRect: rect.width > 0 && rect.height > 0,
        disclaimerVisible: Boolean(panel.querySelector('.comparison-disclaimer')?.getClientRects().length),
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });
    const ok = state.panelFound === true && state.hiddenAttribute === true && state.display === 'none' && state.visibleRect === false && state.disclaimerVisible === false && state.pageOverflow === false;
    const result = { device: device.name, ok, ...state };
    results.push(result);
    if (!ok) failures.push(result);
    await context.close();
  }
} finally {
  await browser.close();
}

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  ok: failures.length === 0,
  contract: 'Zero selected records keep the comparison region fully hidden on desktop and mobile.',
  results,
  failures
};

fs.writeFileSync(path.join(outputDir, 'zero-state.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit, null, 2));
if (failures.length) process.exit(1);
