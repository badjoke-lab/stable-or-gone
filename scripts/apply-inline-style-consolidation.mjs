#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/site-ui.css';
const inlineFiles = [
  'src/components/EvidenceSourceTable.astro',
  'src/components/StaticRegistryPagination.astro',
  'src/pages/stablecoin/[slug].astro',
  'src/pages/updates/circle-national-trust-usdc/index.astro',
  'src/pages/updates/visa-stablecoin-platform-open-usd/index.astro'
];

const stripped = [];
for (const file of inlineFiles) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const next = source.replace(/\n\s*<style(?:\s[^>]*)?>[^]*?<\/style>\s*(?=\n|$)/gi, '');
  if (next !== source) {
    fs.writeFileSync(file, next);
    stripped.push(file);
  }
}

let css = fs.readFileSync(cssPath, 'utf8');

if (!css.includes('--ink: var(--ui-copy);')) {
  css = css.replace('  --ui-neutral: #b4babd;\n', '  --ui-neutral: #b4babd;\n  --ink: var(--ui-copy);\n  --ink-muted: var(--ui-muted);\n  --line: var(--ui-line);\n  --surface-subtle: var(--ui-surface);\n');
}

const fontSizeMap = new Map([
  ['.75rem', '.8125rem'],
  ['.8125rem', '.875rem'],
  ['.875rem', '.9375rem']
]);
css = css.replace(/\.(?:75|8125|875)rem\b/g, (value) => fontSizeMap.get(value) ?? value);

const staticRegistryBlock = `
/* Static registry pagination */
.static-registry-page { width: 100%; margin: 0 auto; padding: 1.25rem 0 3.5rem; color: var(--ui-copy); }
.static-registry-header { padding: 1rem 0 1.5rem; border-top: 2px solid var(--ui-text); border-bottom: 1px solid var(--ui-line); }
.static-registry-headerline { margin-bottom: 1.25rem; display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
.static-registry-eyebrow,
.static-registry-range { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); letter-spacing: .055em; text-transform: uppercase; }
.static-registry-header h1 { max-width: 24ch; font-size: clamp(2.5rem, 4.2vw, 4rem); line-height: 1.05; text-wrap: balance; }
.static-registry-description { max-width: 760px; margin-top: 1.15rem; color: var(--ui-copy); font-size: 1.0625rem; line-height: 1.7; }
.static-registry-note { max-width: 760px; margin-top: .65rem; color: var(--ui-muted); font-size: .9375rem; line-height: 1.6; }
.static-registry-list { margin: 1.5rem 0 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); list-style: none; border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
.static-registry-list li { min-width: 0; min-height: 120px; padding: 1rem; display: grid; grid-template-columns: 2.4rem minmax(0, 1fr); gap: .8rem; align-content: start; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
.static-registry-number { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); font-variant-numeric: tabular-nums; }
.static-registry-item-copy { min-width: 0; }
.static-registry-list a { color: var(--ui-text); font-size: 1.0625rem; font-weight: 750; line-height: 1.35; overflow-wrap: anywhere; }
.static-registry-meta,
.static-registry-item-description { margin-top: .45rem; color: var(--ui-muted); font-size: .9375rem; line-height: 1.55; overflow-wrap: anywhere; }
.static-registry-item-description { color: var(--ui-copy); }
.static-registry-footer { margin-top: 1.5rem; padding-top: 1rem; display: flex; justify-content: space-between; gap: 1.25rem; align-items: center; border-top: 1px solid var(--ui-line); }
.static-registry-pagination { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; }
.static-registry-pagination a { min-width: 44px; min-height: 44px; padding: .5rem .75rem; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-elevated); color: var(--ui-copy); font-size: .9375rem; font-weight: 750; text-decoration: none; }
.static-registry-pagination a:hover,
.static-registry-pagination a:focus-visible { border-color: var(--ui-link-hover); color: var(--ui-link-hover); }
.static-registry-pagination a[aria-current="page"] { border-color: var(--ui-link); background: var(--ui-link); color: var(--ui-bg); }
.static-registry-direction { padding-inline: 1rem; }
.static-registry-return { font-size: .9375rem; text-align: right; }
.static-registry-return a { color: var(--ui-muted); }

@media (max-width: 720px) {
  .static-registry-headerline,
  .static-registry-footer { align-items: flex-start; flex-direction: column; }
  .static-registry-header h1 { max-width: none; font-size: clamp(2.2rem, 9vw, 3rem); text-wrap: pretty; }
  .static-registry-list { grid-template-columns: 1fr; }
  .static-registry-list li { min-height: 0; padding: 1rem .75rem; grid-template-columns: 2rem minmax(0, 1fr); }
  .static-registry-return { text-align: left; }
}
`;

const stablecoinContainmentBlock = `
/* Stablecoin detail containment */
.stablecoin-dossier[data-dossier-version="pr415"] { width: min(1280px, 100%); max-width: 100%; min-width: 0; overflow-x: clip; }
.stablecoin-dossier[data-dossier-version="pr415"] > *,
.stablecoin-dossier[data-dossier-version="pr415"] .stablecoin-dossier-section,
.stablecoin-dossier[data-dossier-version="pr415"] .stablecoin-organizations-control { min-width: 0; max-width: 100%; }
@supports not (overflow: clip) {
  .stablecoin-dossier[data-dossier-version="pr415"] { overflow-x: hidden; }
}
`;

const circleAnalysisBlock = `
/* Circle National Trust analysis article */
.analysis-article { max-width: 820px; margin: 0 auto; padding: 1rem 0 4rem; color: var(--ui-copy); font: 400 1.0625rem/1.82 var(--ui-sans); overflow-wrap: anywhere; }
.analysis-masthead { padding: .8rem 0 2rem; border-top: 2px solid var(--ui-text); border-bottom: 1px solid var(--ui-line); }
.analysis-overline { min-height: 42px; display: flex; justify-content: space-between; gap: 1rem; align-items: center; color: var(--ui-muted); font: 700 .875rem/1.4 var(--ui-mono); letter-spacing: .04em; text-transform: uppercase; }
.analysis-overline a { font-family: var(--ui-sans); letter-spacing: 0; text-transform: none; }
.analysis-article h1 { max-width: 20ch; margin: 1.25rem 0; font-size: clamp(2.5rem, 5vw, 4.4rem); line-height: 1.08; }
.analysis-deck { max-width: 50rem; color: var(--ui-copy); font-family: var(--ui-serif); font-size: clamp(1.15rem, 2vw, 1.4rem); line-height: 1.7; }
.analysis-meta { margin: 1.5rem 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
.analysis-meta > div { min-height: 82px; padding: .85rem 1rem; display: grid; align-content: space-between; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
.analysis-meta dd { margin: .25rem 0 0; color: var(--ui-text); }
.analysis-boundary,
.analysis-summary { margin: 1.5rem 0; padding: 1.25rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.analysis-article > section { margin: 0; padding: 2.5rem 0; border-bottom: 1px solid var(--ui-line); }
.analysis-article > section > h2 { margin-bottom: 1rem; }
.analysis-article p,
.analysis-article li { font-size: 1.0625rem; line-height: 1.82; }
.analysis-article li + li { margin-top: .6rem; }
.analysis-facts { margin: 1.25rem 0; border-top: 1px solid var(--ui-line); }
.analysis-facts > div { padding: .9rem 0; display: grid; grid-template-columns: 10rem minmax(0, 1fr); gap: 1rem; border-bottom: 1px solid var(--ui-line); }
.analysis-facts dd { margin: 0; }
.analysis-split { margin: 1.25rem 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.analysis-split > div { padding: 1.1rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.analysis-watchlist { padding: 0; list-style: none; border-top: 1px solid var(--ui-line); }
.analysis-watchlist li { margin: 0; padding: .9rem 0; display: grid; grid-template-columns: 11rem minmax(0, 1fr); gap: 1rem; border-bottom: 1px solid var(--ui-line); }
.analysis-notes,
.analysis-sources { border-top: 2px solid var(--ui-text); }

@media (max-width: 640px) {
  .analysis-overline { align-items: flex-start; flex-direction: column; }
  .analysis-meta,
  .analysis-split { grid-template-columns: 1fr; }
  .analysis-facts > div,
  .analysis-watchlist li { grid-template-columns: 1fr; gap: .3rem; }
  .analysis-article h1 { font-size: clamp(2.2rem, 10vw, 3.2rem); }
}
`;

const marker = '/* Update analysis article */';
if (!css.includes(marker)) throw new Error('single CSS insertion marker missing');
for (const [signature, block] of [
  ['/* Static registry pagination */', staticRegistryBlock],
  ['/* Stablecoin detail containment */', stablecoinContainmentBlock],
  ['/* Circle National Trust analysis article */', circleAnalysisBlock]
]) {
  if (!css.includes(signature)) css = css.replace(marker, `${block}\n${marker}`);
}
fs.writeFileSync(cssPath, css);

const staleTrigger = 'artifacts/.trigger-runtime-audit-role-fixes';
if (fs.existsSync(staleTrigger)) fs.rmSync(staleTrigger);

console.log(JSON.stringify({ stripped, css: cssPath, removed_trigger: !fs.existsSync(staleTrigger) }, null, 2));
