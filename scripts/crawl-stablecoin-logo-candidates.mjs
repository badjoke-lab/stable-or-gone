#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const manifestPath = path.join(root, 'artifacts/stablecoin-logo-research.json');
const outputRoot = path.join(root, 'artifacts/stablecoin-logo-candidates');
const reportPath = path.join(root, 'artifacts/stablecoin-logo-candidates.json');
const githubToken = process.env.GITHUB_TOKEN ?? '';
const maxBytes = 1_500_000;
const maxCandidatesPerRecord = 6;
const timeoutMs = 12_000;

if (!fs.existsSync(manifestPath)) throw new Error(`missing ${manifestPath}`);
fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');
const extForType = (type, url) => {
  const pathname = (() => { try { return new URL(url).pathname; } catch { return ''; } })();
  const ext = path.extname(pathname).toLowerCase();
  if (['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  if (type?.includes('svg')) return '.svg';
  if (type?.includes('png')) return '.png';
  if (type?.includes('webp')) return '.webp';
  if (type?.includes('gif')) return '.gif';
  if (type?.includes('jpeg') || type?.includes('jpg')) return '.jpg';
  return '.bin';
};
const absoluteUrl = (candidate, base) => {
  try { return new URL(candidate, base).href; } catch { return null; }
};
const decodeHtml = (value) => String(value ?? '')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map((match) => [match[1].toLowerCase(), decodeHtml(match[2] ?? match[3] ?? match[4] ?? '')]));
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Stable-or-Gone-logo-audit/1.0 (+https://sog.badjoke-lab.com)',
        accept: options.accept ?? '*/*',
        ...(options.headers ?? {})
      },
      signal: controller.signal
    });
  } finally { clearTimeout(timer); }
};
const githubRepoFromUrl = (value) => {
  try {
    const url = new URL(value);
    if (url.hostname !== 'github.com') return null;
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, '') };
  } catch { return null; }
};

async function githubCandidates(sourceUrl, record) {
  const repo = githubRepoFromUrl(sourceUrl);
  if (!repo) return [];
  const headers = { accept: 'application/vnd.github+json' };
  if (githubToken) headers.authorization = `Bearer ${githubToken}`;
  const repositoryResponse = await fetchWithTimeout(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, { headers });
  if (!repositoryResponse.ok) return [];
  const repository = await repositoryResponse.json();
  const treeResponse = await fetchWithTimeout(`https://api.github.com/repos/${repo.owner}/${repo.repo}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`, { headers });
  if (!treeResponse.ok) return [];
  const tree = await treeResponse.json();
  const symbol = normalize(record.symbol);
  const slug = normalize(record.slug);
  const aliases = [record.name, record.symbol, record.slug, ...(record.aliases ?? [])].map(normalize).filter(Boolean);
  return (tree.tree ?? [])
    .filter((entry) => entry.type === 'blob' && /\.(svg|png|jpe?g|webp)$/i.test(entry.path))
    .map((entry) => {
      const key = normalize(entry.path);
      let score = 0;
      if (/logo|icon|token|coin|brand/.test(key)) score += 20;
      if (symbol && key.includes(symbol)) score += 55;
      if (slug && key.includes(slug)) score += 45;
      if (aliases.some((alias) => alias.length >= 3 && key.includes(alias))) score += 35;
      if (/node_modules|vendor|test|fixture|screenshot|banner|hero|background/.test(key)) score -= 35;
      return {
        asset_url: `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${repository.default_branch}/${entry.path.split('/').map(encodeURIComponent).join('/')}`,
        source_page: sourceUrl,
        source_type: 'official_github',
        evidence: entry.path,
        score
      };
    })
    .filter((candidate) => candidate.score >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

async function htmlCandidates(sourceUrl, record) {
  const response = await fetchWithTimeout(sourceUrl, { accept: 'text/html,application/xhtml+xml' });
  if (!response.ok) return [];
  const type = response.headers.get('content-type') ?? '';
  if (!type.includes('html') && !type.includes('xhtml')) return [];
  const html = await response.text();
  const candidates = [];
  const aliases = [record.name, record.symbol, record.slug, ...(record.aliases ?? [])].map(normalize).filter(Boolean);
  const symbol = normalize(record.symbol);
  const push = (asset, sourceType, evidence, baseScore = 0) => {
    const assetUrl = absoluteUrl(asset, response.url);
    if (!assetUrl || !/^https?:/.test(assetUrl)) return;
    const key = normalize(`${assetUrl} ${evidence}`);
    let score = baseScore;
    if (/logo|icon|token|coin|brand|mark/.test(key)) score += 18;
    if (symbol && key.includes(symbol)) score += 60;
    if (aliases.some((alias) => alias.length >= 3 && key.includes(alias))) score += 40;
    if (/favicon|appletouch/.test(key)) score -= 8;
    if (/hero|banner|background|blog|article|press|thumbnail/.test(key)) score -= 20;
    candidates.push({ asset_url: assetUrl, source_page: sourceUrl, source_type: sourceType, evidence, score });
  };
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    const rel = String(a.rel ?? '').toLowerCase();
    if (rel.includes('icon') && a.href) push(a.href, 'official_site_icon', `${rel} ${a.sizes ?? ''}`, rel.includes('apple') ? 14 : 10);
  }
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    const property = String(a.property ?? a.name ?? '').toLowerCase();
    if (['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src'].includes(property) && a.content) push(a.content, 'official_site_meta_image', property, 8);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    const src = a.src ?? a['data-src'] ?? a['data-lazy-src'] ?? a.srcset?.split(',')[0]?.trim().split(/\s+/)[0];
    if (!src) continue;
    const evidence = `${a.alt ?? ''} ${a.title ?? ''} ${a.class ?? ''} ${a.id ?? ''}`;
    const normalizedEvidence = normalize(evidence);
    const baseScore = aliases.some((alias) => alias.length >= 2 && normalizedEvidence.includes(alias)) ? 55 : 0;
    push(src, 'official_site_image', evidence, baseScore);
  }
  return candidates.sort((a, b) => b.score - a.score).slice(0, 18);
}

async function downloadCandidate(candidate, record, index) {
  const response = await fetchWithTimeout(candidate.asset_url, { accept: 'image/*,*/*;q=0.5' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get('content-type') ?? '';
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) throw new Error('empty body');
  if (buffer.length > maxBytes) throw new Error(`asset too large: ${buffer.length}`);
  const ext = extForType(type, response.url);
  if (ext === '.bin') throw new Error(`unsupported content type: ${type}`);
  const directory = path.join(outputRoot, record.slug);
  fs.mkdirSync(directory, { recursive: true });
  const filename = `${String(index + 1).padStart(2, '0')}-${crypto.createHash('sha1').update(response.url).digest('hex').slice(0, 10)}${ext}`;
  const relative = path.join(record.slug, filename).replaceAll('\\', '/');
  fs.writeFileSync(path.join(outputRoot, relative), buffer);
  return { ...candidate, fetched_url: response.url, content_type: type, bytes: buffer.length, local_file: relative };
}

const records = [];
for (const [recordIndex, record] of manifest.unresolved.entries()) {
  const rawCandidates = [];
  const sourceErrors = [];
  for (const sourceUrl of record.candidate_official_urls.slice(0, 10)) {
    try {
      const github = githubRepoFromUrl(sourceUrl);
      rawCandidates.push(...(github ? await githubCandidates(sourceUrl, record) : await htmlCandidates(sourceUrl, record)));
    } catch (error) {
      sourceErrors.push({ source_url: sourceUrl, error: error instanceof Error ? error.message : String(error) });
    }
  }
  const deduplicated = [...new Map(rawCandidates.map((candidate) => [candidate.asset_url, candidate])).values()]
    .sort((a, b) => b.score - a.score);
  const downloaded = [];
  const downloadErrors = [];
  for (const candidate of deduplicated) {
    if (downloaded.length >= maxCandidatesPerRecord) break;
    try { downloaded.push(await downloadCandidate(candidate, record, downloaded.length)); }
    catch (error) { downloadErrors.push({ asset_url: candidate.asset_url, error: error instanceof Error ? error.message : String(error) }); }
  }
  records.push({
    slug: record.slug,
    symbol: record.symbol,
    name: record.name,
    issuer: record.issuer,
    deployments: record.deployments,
    official_urls: record.candidate_official_urls,
    candidates: downloaded,
    source_errors: sourceErrors,
    download_errors: downloadErrors.slice(0, 12)
  });
  console.log(`[${recordIndex + 1}/${manifest.unresolved.length}] ${record.slug}: ${downloaded.length} candidates`);
}

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  unresolved_records: manifest.unresolved.length,
  records_with_candidates: records.filter((record) => record.candidates.length > 0).length,
  candidate_files: records.reduce((sum, record) => sum + record.candidates.length, 0),
  records
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
const html = `<!doctype html><meta charset="utf-8"><title>Stablecoin logo candidates</title><style>body{font:14px system-ui;margin:20px;background:#f3f0e7;color:#171714}.record{border-top:1px solid #171714;padding:16px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}.candidate{border:1px solid #999;padding:10px;min-width:0}.candidate img{width:96px;height:96px;object-fit:contain;display:block;background:white}.candidate code{display:block;font-size:11px;overflow-wrap:anywhere}.meta{color:#555}</style>${records.map((record)=>`<section class="record"><h2>${record.name} <small>${record.symbol}</small></h2><p class="meta">${record.slug} · ${record.candidates.length} candidates</p><div class="grid">${record.candidates.map((candidate)=>`<article class="candidate"><img src="${candidate.local_file}" alt=""><strong>score ${candidate.score}</strong><code>${candidate.source_type}</code><code>${candidate.evidence}</code><code>${candidate.asset_url}</code></article>`).join('')}</div></section>`).join('')}`;
fs.writeFileSync(path.join(outputRoot, 'index.html'), html);
console.log(JSON.stringify({ records: records.length, records_with_candidates: report.records_with_candidates, candidate_files: report.candidate_files }, null, 2));
