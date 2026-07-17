import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.join(root, 'artifacts/pr415-stablecoin-dossier');
fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const states = [
  { id: 'usdc-desktop', slug: 'usdc', state: 'deep-active-fiat-backed', route: '/stablecoin/usdc/', viewport: { width: 1440, height: 1000 } },
  { id: 'usdc-mobile', slug: 'usdc', state: 'deep-active-fiat-backed', route: '/stablecoin/usdc/', viewport: { width: 390, height: 844 } },
  { id: 'ust-desktop', slug: 'ust', state: 'failed-algorithmic', route: '/stablecoin/ust/', viewport: { width: 1440, height: 1000 } },
  { id: 'ust-mobile', slug: 'ust', state: 'failed-algorithmic', route: '/stablecoin/ust/', viewport: { width: 390, height: 844 } },
  { id: 'busd-desktop', slug: 'busd', state: 'discontinued-wind-down', route: '/stablecoin/busd/', viewport: { width: 1440, height: 1000 } },
  { id: 'busd-mobile', slug: 'busd', state: 'discontinued-wind-down', route: '/stablecoin/busd/', viewport: { width: 390, height: 844 } }
];

const browser = await chromium.launch({ headless: true });
const records = [];
const failures = [];
try {
  for (const state of states) {
    const context = await browser.newContext({ viewport: state.viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${state.route}`, { waitUntil: 'networkidle', timeout: 45_000 });
    if (!response?.ok()) {
      failures.push(`${state.id}: HTTP ${response?.status() ?? 'no response'}`);
      await context.close();
      continue;
    }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('[data-dossier-version="pr415"]', { timeout: 15_000 });
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const horizontalOverflow = Math.max(body.scrollWidth, html.scrollWidth) > html.clientWidth + 1;
      const dossier = document.querySelector('[data-dossier-version="pr415"]');
      const shell = document.querySelector('[data-shell="evidence-registry-pr411"]');
      const nav = document.querySelector('.stablecoin-dossier-nav');
      const decisionItems = document.querySelectorAll('.stablecoin-decision-grid > div').length;
      const sections = {
        overview: Boolean(document.querySelector('#assessment')),
        redemptionReserves: Boolean(document.querySelector('#reserves-redemption')),
        organizations: Boolean(document.querySelector('#organizations-control')),
        mechanism: Boolean(document.querySelector('#mechanism')),
        history: Boolean(document.querySelector('#history')),
        deployments: Boolean(document.querySelector('#deployments-legal-context')),
        unknowns: Boolean(document.querySelector('#known-unknowns')),
        evidence: Boolean(document.querySelector('#evidence'))
      };
      const technicalDisclosure = document.querySelector('.stablecoin-technical-disclosure');
      const title = document.querySelector('.stablecoin-dossier-title-row h1')?.textContent?.trim() ?? '';
      const status = document.querySelector('.stablecoin-dossier-title-row > [class*="chip"], .stablecoin-dossier-title-row > [class*="status"]')?.textContent?.trim() ?? '';
      const anchors = [...document.querySelectorAll('.stablecoin-dossier-nav a')].map((anchor) => anchor.getAttribute('href'));
      return {
        horizontalOverflow,
        shellPresent: Boolean(shell),
        dossierPresent: Boolean(dossier),
        navPresent: Boolean(nav),
        decisionItems,
        sections,
        technicalDisclosurePresent: Boolean(technicalDisclosure),
        title,
        status,
        anchors,
        bodyHeight: body.scrollHeight,
        viewportWidth: html.clientWidth,
        scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
        documentTitle: document.title
      };
    });

    if (!metrics.shellPresent) failures.push(`${state.id}: shared shell missing`);
    if (!metrics.dossierPresent) failures.push(`${state.id}: PR #415 dossier marker missing`);
    if (!metrics.navPresent) failures.push(`${state.id}: dossier navigation missing`);
    if (metrics.decisionItems !== 6) failures.push(`${state.id}: expected 6 decision summary items, found ${metrics.decisionItems}`);
    if (!metrics.technicalDisclosurePresent) failures.push(`${state.id}: technical disclosure missing`);
    for (const [section, present] of Object.entries(metrics.sections)) if (!present) failures.push(`${state.id}: ${section} section missing`);
    if (metrics.horizontalOverflow) failures.push(`${state.id}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`);
    if (!metrics.title) failures.push(`${state.id}: dossier title missing`);

    const fileName = `${state.id}.png`;
    await page.screenshot({ path: path.join(outputRoot, fileName), fullPage: true, animations: 'disabled' });
    records.push({ ...state, file: fileName, metrics });
    await context.close();
  }
} finally {
  await browser.close();
}

if (records.length !== states.length) failures.push(`expected ${states.length} captures, found ${records.length}`);
const manifest = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_pr: 415,
  owner_approval: false,
  expected_capture_count: states.length,
  capture_count: records.length,
  failure_count: failures.length,
  horizontal_overflow_failure_count: failures.filter((failure) => failure.includes('horizontal overflow')).length,
  records,
  failures
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(manifest, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, captures: records.length, owner_approval: false, output: 'artifacts/pr415-stablecoin-dossier' }, null, 2));
