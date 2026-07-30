#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const replaceOnce = (source, before, after, label) => {
  if (!source.includes(before)) throw new Error(`Missing expected CSS fragment: ${label}`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');
css = replaceOnce(css,
  `.site-nav a, .site-primary-navigation a { min-height: 44px; padding-inline: 6px; font-size: 14px; } .site-more-navigation > summary { min-height: 44px; padding-inline: 9px; font-size: 14px; }`,
  `.site-nav a, .site-primary-navigation a { min-height: 44px; padding-inline: 5px; font-size: 15px; } .site-more-navigation > summary { min-height: 44px; padding-inline: 8px; font-size: 15px; }`,
  'mobile navigation type');
css = replaceOnce(css,
  `.home-intro { gap: 13px; padding: 10px 0 13px; } .home-intro h1 { max-width: 11ch; margin-bottom: 7px; font-size: clamp(2.05rem,10vw,2.65rem); line-height: .98; } .home-intro .lede { max-width: 34rem; font-size: 15px; line-height: 1.42; }`,
  `.home-intro { gap: 13px; padding: 10px 0 13px; } .home-intro h1 { max-width: 11ch; margin-bottom: 7px; font-size: clamp(2.05rem,10vw,2.65rem); line-height: .98; } .home-intro .lede { max-width: 34rem; font-size: 16px; line-height: 1.45; }`,
  'mobile hero copy');
css = replaceOnce(css,
  `.home-facts div { min-height: 68px; padding: 8px 10px; gap: 3px; } .home-facts dd { font-size: 1.55rem; line-height: 1; } .home-facts dd small { margin-top: 3px; font-size: 11px; line-height: 1.25; }`,
  `.home-facts div { min-height: 72px; padding: 8px 10px; gap: 3px; } .home-facts dd { font-size: 1.55rem; line-height: 1; } .home-facts dd small { margin-top: 3px; font-size: 13px; line-height: 1.35; }`,
  'mobile KPI metadata');
css = replaceOnce(css,
  `.home-registry-heading { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 8px; padding-top: 8px; margin-bottom: 8px; } .home-registry-heading h2 { margin-bottom: 0; font-size: 1.45rem; } .registry-heading-link { min-height: 36px; font-size: 13px; } .registry-count { padding: 8px 10px; justify-content: space-between; gap: 4px 10px; font-size: 13px; }`,
  `.home-registry-heading { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 8px; padding-top: 8px; margin-bottom: 8px; } .home-registry-heading h2 { margin-bottom: 0; font-size: 1.45rem; } .registry-heading-link { min-height: 44px; font-size: 15px; } .registry-count { padding: 8px 10px; justify-content: space-between; gap: 4px 10px; font-size: 13px; }`,
  'registry heading action');
css = replaceOnce(css,
  `.home-registry-table tr { display: grid; grid-template-columns: minmax(0,1fr) minmax(104px,.68fr); grid-template-areas: "identity lifecycle" "organization reference" "reviewed evidence"; column-gap: 12px; row-gap: 5px; padding: 10px; border-bottom: 1px solid var(--ui-text); } .home-registry-table td { min-width: 0; padding: 0; border: 0; font-size: 14px; line-height: 1.32; }`,
  `.home-registry-table tr { display: grid; grid-template-columns: minmax(0,1fr) minmax(104px,.68fr); grid-template-areas: "identity lifecycle" "organization reference" "reviewed evidence"; column-gap: 12px; row-gap: 5px; padding: 10px; border-bottom: 1px solid var(--ui-text); } .home-registry-table td { min-width: 0; padding: 0; border: 0; font-size: 15px; line-height: 1.35; }`,
  'registry compact values');
css = replaceOnce(css,
  `.home-registry-table .stablecoin-dossier-heading-identity { align-items: center; gap: 8px; } .home-registry-table .stablecoin-mark--small { width: 30px; height: 30px; } .home-registry-table td:first-child a { font-size: 15px; line-height: 1.15; } .home-registry-table td:first-child small { margin-top: 1px; font-size: 12px; line-height: 1.2; } .home-registry-table .chip { padding: 2px 6px; font-size: 12px; white-space: nowrap; }`,
  `.home-registry-table .stablecoin-dossier-heading-identity { align-items: center; gap: 8px; } .home-registry-table .stablecoin-mark--small { width: 30px; height: 30px; } .home-registry-table td:first-child a { font-size: 15px; line-height: 1.35; } .home-registry-table td:first-child small { margin-top: 1px; font-size: 13px; line-height: 1.35; } .home-registry-table .chip { padding: 2px 6px; font-size: 13px; white-space: nowrap; }`,
  'registry identity metadata');
css = replaceOnce(css,
  `.home-registry-evidence strong, .home-registry-evidence small { display: inline; margin: 0; } .home-registry-evidence small { font-size: 12px; } .registry-count--footer { padding: 8px 10px; } .registry-count--footer .support-cta { width: 100%; min-height: 40px; }`,
  `.home-registry-evidence strong, .home-registry-evidence small { display: inline; margin: 0; } .home-registry-evidence small { font-size: 13px; line-height: 1.35; } .registry-count--footer { padding: 8px 10px; } .registry-count--footer .support-cta { width: 100%; min-height: 40px; }`,
  'registry evidence metadata');

fs.writeFileSync(cssPath, css);
fs.rmSync('scripts/apply-home-readability-floor.mjs', { force: true });
fs.rmSync('.github/workflows/apply-home-readability-floor.yml', { force: true });
const lines = css.split('\n').length;
if (lines >= 553) throw new Error(`CSS line count outside contract: ${lines}`);
console.log(`Applied mobile readability floors; public-ui.css remains ${lines} lines.`);
