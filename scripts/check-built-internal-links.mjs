#!/usr/bin/env node
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://www.stableorgone.com';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function routeForHtml(file) {
  const relative = path.relative(DIST, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function targetCandidates(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (!clean) return [path.join(DIST, 'index.html')];
  const direct = path.join(DIST, clean);
  if (pathname.endsWith('/')) return [path.join(direct, 'index.html')];
  if (path.extname(clean)) return [direct];
  return [direct, path.join(direct, 'index.html'), `${direct}.html`];
}

function anchorHrefs(html) {
  const values = [];
  const pattern = /<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1/gi;
  for (const match of html.matchAll(pattern)) values.push(match[2]);
  return values;
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
const failures = [];
let checkedLinks = 0;

for (const file of htmlFiles) {
  const sourceRoute = routeForHtml(file);
  const html = await readFile(file, 'utf8');
  for (const rawHref of anchorHrefs(html)) {
    const href = rawHref.trim();
    if (!href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;

    let target;
    try {
      target = new URL(href, new URL(sourceRoute, ORIGIN));
    } catch {
      failures.push({ source: sourceRoute, href, reason: 'invalid-url' });
      continue;
    }

    if (target.origin !== ORIGIN) continue;
    checkedLinks += 1;
    const candidates = targetCandidates(target.pathname);
    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }
    if (!found) failures.push({ source: sourceRoute, href, pathname: target.pathname, reason: 'missing-built-target' });
  }
}

console.log(JSON.stringify({
  html_files: htmlFiles.length,
  internal_links_checked: checkedLinks,
  broken_internal_links: failures.length,
  failures: failures.slice(0, 100)
}, null, 2));

if (failures.length) process.exit(1);
