#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const root = process.cwd();
const distRoot = path.join(root, 'dist');
const legacyHostname = ['sog', 'badjoke-lab', 'com'].join('.');
const failures = [];
const htmlRecords = [];
let nonIndexableHtmlChecked = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function relativeRoute(file) {
  const relative = path.relative(distRoot, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function firstAttribute(html, pattern) {
  return html.match(pattern)?.[1] ?? null;
}

if (!fs.existsSync(distRoot)) {
  console.error('dist is missing; run npm run build first');
  process.exit(1);
}

const files = walk(distRoot);
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.xml', '.json', '.txt'].includes(ext)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).split(path.sep).join('/');
  if (content.includes(legacyHostname)) failures.push(`${relative}: legacy hostname remains in built output`);

  if (ext !== '.html') continue;
  const distRelative = path.relative(distRoot, file).split(path.sep).join('/');
  if (distRelative === '404.html') {
    nonIndexableHtmlChecked += 1;
    continue;
  }

  const route = relativeRoute(file);
  const expected = new URL(route, `${PUBLIC_ORIGIN}/`).toString();
  const canonical = firstAttribute(content, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    ?? firstAttribute(content, /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const ogUrl = firstAttribute(content, /<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    ?? firstAttribute(content, /<meta\b[^>]*content=["']([^"']+)["'][^>]*property=["']og:url["'][^>]*>/i);
  const canonicalCount = [...content.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].length;

  if (canonicalCount !== 1) failures.push(`${route}: expected exactly one canonical link, found ${canonicalCount}`);
  if (canonical !== expected) failures.push(`${route}: canonical ${canonical ?? 'missing'} != ${expected}`);
  if (ogUrl !== expected) failures.push(`${route}: og:url ${ogUrl ?? 'missing'} != ${expected}`);
  if (canonical && new URL(canonical).origin !== PUBLIC_ORIGIN) failures.push(`${route}: canonical origin is not ${PUBLIC_ORIGIN}`);
  if (ogUrl && new URL(ogUrl).origin !== PUBLIC_ORIGIN) failures.push(`${route}: og:url origin is not ${PUBLIC_ORIGIN}`);

  htmlRecords.push({ route, canonical, og_url: ogUrl });
}

const robots = fs.readFileSync(path.join(distRoot, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${PUBLIC_ORIGIN}/sitemap-index.xml`)) failures.push('robots.txt: official sitemap origin mismatch');

const sitemapFiles = files.filter((file) => file.endsWith('.xml'));
for (const file of sitemapFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const url of urls) {
    try {
      if (new URL(url).origin !== PUBLIC_ORIGIN) failures.push(`${path.relative(root, file)}: sitemap URL uses noncanonical origin ${url}`);
    } catch {
      failures.push(`${path.relative(root, file)}: invalid sitemap URL ${url}`);
    }
  }
}

const result = {
  ok: failures.length === 0,
  public_origin: PUBLIC_ORIGIN,
  indexable_html_routes_checked: htmlRecords.length,
  non_indexable_html_checked: nonIndexableHtmlChecked,
  sitemap_files_checked: sitemapFiles.length,
  legacy_hostname_findings: failures.filter((item) => item.includes('legacy hostname')).length,
  failures
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(root, 'artifacts', 'built-origin-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
