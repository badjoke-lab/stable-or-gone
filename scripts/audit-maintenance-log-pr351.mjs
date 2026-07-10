#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const outputDir = path.join(root, 'artifacts/maintenance-log');
fs.mkdirSync(outputDir, { recursive: true });
const log = JSON.parse(fs.readFileSync(path.join(root, 'dist/data/maintenance-log.json'), 'utf8'));
const browser = await chromium.launch();
const failures = [];
const results = [];

const inspect = async (page) => page.evaluate(() => ({
  month_entries: document.querySelectorAll('[data-maintenance-month]').length,
  check_cards: document.querySelectorAll('.maintenance-check').length,
  release_links: document.querySelectorAll('.maintenance-releases a').length,
  passed_checks: document.querySelectorAll('.maintenance-check[data-result="passed"]').length,
  page_horizontal_overflow_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
  has_boundary_heading: document.body.textContent?.includes('Operational transparency without exposing the research queue') ?? false,
  has_internal_boundary: document.body.textContent?.includes('What stays internal') ?? false,
  has_update_feed_link: Boolean(document.querySelector('a[href="/updates/"]')),
  has_timeline_link: Boolean(document.querySelector('a[href="/timeline/"]')),
  has_methodology_link: Boolean(document.querySelector('a[href="/methodology/"]')),
  machine_link: Boolean(document.querySelector('a[href="/data/maintenance-log.json"]'))
}));

for (const viewport of [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 393, height: 852, isMobile: true }
]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.isMobile, hasTouch: viewport.isMobile, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const response = await page.goto(`${baseUrl}/maintenance/`, { waitUntil: 'networkidle', timeout: 90000 });
  if (!response || !response.ok()) failures.push(`${viewport.name}: maintenance route returned ${response?.status() ?? 'no response'}`);
  await page.waitForSelector('[data-maintenance-month]', { timeout: 60000 });
  const result = await inspect(page);
  results.push({ viewport: viewport.name, ...result });
  const expectedChecks = log.entries.reduce((sum, entry) => sum + entry.checks.length, 0);
  const expectedReleases = log.entries.reduce((sum, entry) => sum + entry.public_surface_releases.length, 0);
  const expectedPassed = log.entries.flatMap((entry) => entry.checks).filter((check) => check.result === 'passed').length;
  if (result.month_entries !== log.entries.length) failures.push(`${viewport.name}: expected ${log.entries.length} month entries, found ${result.month_entries}`);
  if (result.check_cards !== expectedChecks) failures.push(`${viewport.name}: expected ${expectedChecks} checks, found ${result.check_cards}`);
  if (result.release_links !== expectedReleases) failures.push(`${viewport.name}: expected ${expectedReleases} release links, found ${result.release_links}`);
  if (result.passed_checks !== expectedPassed) failures.push(`${viewport.name}: expected ${expectedPassed} passed checks, found ${result.passed_checks}`);
  if (result.page_horizontal_overflow_px > 2) failures.push(`${viewport.name}: page overflow ${result.page_horizontal_overflow_px}px`);
  if (!result.has_boundary_heading || !result.has_internal_boundary) failures.push(`${viewport.name}: public/internal boundary explanation missing`);
  if (!result.has_update_feed_link || !result.has_timeline_link || !result.has_methodology_link) failures.push(`${viewport.name}: related public layer link missing`);
  if (!result.machine_link) failures.push(`${viewport.name}: machine-readable log link missing`);
  await page.screenshot({ path: path.join(outputDir, `${viewport.name}-maintenance-log.png`), fullPage: true });
  await context.close();
}

await browser.close();
const output = {
  schema_version: '1.0',
  audit_id: 'sog_monthly_maintenance_log_visual_audit_pr351',
  route: '/maintenance/',
  expected_month_entries: log.entries.length,
  results,
  failures,
  ok: failures.length === 0
};
fs.writeFileSync(path.join(outputDir, 'audit.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
if (failures.length) process.exit(1);
