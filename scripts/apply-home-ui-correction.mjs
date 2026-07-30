#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const replaceOnce = (source, before, after, label) => {
  if (!source.includes(before)) throw new Error(`Missing expected CSS block: ${label}`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');

css = replaceOnce(
  css,
  `.registry-section--priority { margin-top: 22px; }
.section-heading, .home-section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-top: 11px; margin-bottom: 12px; border-top: 1px solid var(--ui-text); }
.home-registry-heading { align-items: end; }
.registry-heading-link { min-height: 44px; display: inline-flex; align-items: center; color: var(--ui-link); font-weight: 700; white-space: nowrap; }`,
  `.registry-section--priority { margin-top: 22px; } .section-heading, .home-section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding-top: 11px; margin-bottom: 12px; border-top: 1px solid var(--ui-text); }
.home-registry-heading { align-items: end; } .registry-heading-link { min-height: 44px; display: inline-flex; align-items: center; color: var(--ui-link); font-weight: 700; white-space: nowrap; }`,
  'desktop home priority rules'
);

css = replaceOnce(
  css,
  `  .site-navigation-shell { grid-template-columns: minmax(0,1fr) auto; }
  .site-nav, .site-primary-navigation { overflow: hidden; padding-inline: 0; }
  .site-primary-navigation a:nth-child(n+4) { display: none; }
  .site-nav a, .site-primary-navigation a { min-height: 44px; padding-inline: 6px; font-size: 14px; }
  .site-more-navigation > summary { min-height: 44px; padding-inline: 9px; font-size: 14px; }`,
  `  .site-navigation-shell { grid-template-columns: minmax(0,1fr) auto; } .site-nav, .site-primary-navigation { overflow: hidden; padding-inline: 0; } .site-primary-navigation a:nth-child(n+4) { display: none; }
  .site-nav a, .site-primary-navigation a { min-height: 44px; padding-inline: 6px; font-size: 14px; } .site-more-navigation > summary { min-height: 44px; padding-inline: 9px; font-size: 14px; }`,
  'mobile navigation rules'
);

css = replaceOnce(
  css,
  `  .home-intro { gap: 13px; padding: 10px 0 13px; }
  .home-intro h1 { max-width: 11ch; margin-bottom: 7px; font-size: clamp(2.05rem,10vw,2.65rem); line-height: .98; }
  .home-intro .lede { max-width: 34rem; font-size: 15px; line-height: 1.42; }
  .home-facts div { min-height: 68px; padding: 8px 10px; gap: 3px; }
  .home-facts dd { font-size: 1.55rem; line-height: 1; }
  .home-facts dd small { margin-top: 3px; font-size: 11px; line-height: 1.25; }`,
  `  .home-intro { gap: 13px; padding: 10px 0 13px; } .home-intro h1 { max-width: 11ch; margin-bottom: 7px; font-size: clamp(2.05rem,10vw,2.65rem); line-height: .98; } .home-intro .lede { max-width: 34rem; font-size: 15px; line-height: 1.42; }
  .home-facts div { min-height: 68px; padding: 8px 10px; gap: 3px; } .home-facts dd { font-size: 1.55rem; line-height: 1; } .home-facts dd small { margin-top: 3px; font-size: 11px; line-height: 1.25; }`,
  'mobile hero rules'
);

css = replaceOnce(
  css,
  `  .editorial-directory { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .editorial-directory a { min-height: 82px; padding: 10px; grid-template-columns: 24px minmax(0,1fr) auto; gap: 7px; }
  .directory-copy { gap: 2px; }
  .directory-copy strong { font-size: 1rem; line-height: 1.15; }
  .directory-copy small { display: none; }
  .directory-section { margin-top: 28px; }
  .registry-section--priority { margin-top: 14px; }`,
  `  .editorial-directory { grid-template-columns: repeat(2,minmax(0,1fr)); } .editorial-directory a { min-height: 82px; padding: 10px; grid-template-columns: 24px minmax(0,1fr) auto; gap: 7px; } .directory-copy { gap: 2px; }
  .directory-copy strong { font-size: 1rem; line-height: 1.15; } .directory-copy small { display: none; } .directory-section { margin-top: 28px; } .registry-section--priority { margin-top: 14px; }`,
  'mobile directory rules'
);

css = replaceOnce(
  css,
  `  .home-registry-heading { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 8px; padding-top: 8px; margin-bottom: 8px; }
  .home-registry-heading h2 { margin-bottom: 0; font-size: 1.45rem; }
  .registry-heading-link { min-height: 36px; font-size: 13px; }
  .registry-count { padding: 8px 10px; justify-content: space-between; gap: 4px 10px; font-size: 13px; }
  .home-registry-table-wrap { overflow: visible; }
  .home-registry-table, .home-registry-table thead, .home-registry-table tbody, .home-registry-table tr, .home-registry-table th, .home-registry-table td { display: block; }
  .home-registry-table thead { display: none; }
  .home-registry-table tbody { display: grid; gap: 0; }
  .home-registry-table tr { display: grid; grid-template-columns: minmax(0,1fr) minmax(104px,.68fr); grid-template-areas: "identity lifecycle" "organization reference" "reviewed evidence"; column-gap: 12px; row-gap: 5px; padding: 10px; border-bottom: 1px solid var(--ui-text); }
  .home-registry-table td { min-width: 0; padding: 0; border: 0; font-size: 14px; line-height: 1.32; }
  .home-registry-table td:first-child { grid-area: identity; }
  .home-registry-table td:nth-child(2) { grid-area: lifecycle; align-self: start; justify-self: end; }
  .home-registry-table td:nth-child(3) { grid-area: reference; }
  .home-registry-table td:nth-child(4) { grid-area: organization; }
  .home-registry-table td:nth-child(5) { grid-area: reviewed; }
  .home-registry-table td:nth-child(6) { grid-area: evidence; }
  .home-registry-table td::before { content: attr(data-label); display: block; margin-bottom: 1px; color: var(--ui-muted); font: 700 10px/1.25 var(--ui-mono); letter-spacing: .03em; text-transform: uppercase; }
  .home-registry-table td:first-child::before, .home-registry-table td:nth-child(2)::before { display: none; }
  .home-registry-table .stablecoin-dossier-heading-identity { align-items: center; gap: 8px; }
  .home-registry-table .stablecoin-mark--small { width: 30px; height: 30px; }
  .home-registry-table td:first-child a { font-size: 15px; line-height: 1.15; }
  .home-registry-table td:first-child small { margin-top: 1px; font-size: 12px; line-height: 1.2; }
  .home-registry-table .chip { padding: 2px 6px; font-size: 12px; white-space: nowrap; }
  .home-registry-evidence strong, .home-registry-evidence small { display: inline; margin: 0; }
  .home-registry-evidence small { font-size: 12px; }
  .registry-count--footer { padding: 8px 10px; }
  .registry-count--footer .support-cta { width: 100%; min-height: 40px; }`,
  `  .home-registry-heading { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: 8px; padding-top: 8px; margin-bottom: 8px; } .home-registry-heading h2 { margin-bottom: 0; font-size: 1.45rem; } .registry-heading-link { min-height: 36px; font-size: 13px; } .registry-count { padding: 8px 10px; justify-content: space-between; gap: 4px 10px; font-size: 13px; }
  .home-registry-table-wrap { overflow: visible; } .home-registry-table, .home-registry-table thead, .home-registry-table tbody, .home-registry-table tr, .home-registry-table th, .home-registry-table td { display: block; } .home-registry-table thead { display: none; } .home-registry-table tbody { display: grid; gap: 0; }
  .home-registry-table tr { display: grid; grid-template-columns: minmax(0,1fr) minmax(104px,.68fr); grid-template-areas: "identity lifecycle" "organization reference" "reviewed evidence"; column-gap: 12px; row-gap: 5px; padding: 10px; border-bottom: 1px solid var(--ui-text); } .home-registry-table td { min-width: 0; padding: 0; border: 0; font-size: 14px; line-height: 1.32; }
  .home-registry-table td:first-child { grid-area: identity; } .home-registry-table td:nth-child(2) { grid-area: lifecycle; align-self: start; justify-self: end; } .home-registry-table td:nth-child(3) { grid-area: reference; } .home-registry-table td:nth-child(4) { grid-area: organization; } .home-registry-table td:nth-child(5) { grid-area: reviewed; } .home-registry-table td:nth-child(6) { grid-area: evidence; }
  .home-registry-table td::before { content: attr(data-label); display: block; margin-bottom: 1px; color: var(--ui-muted); font: 700 10px/1.25 var(--ui-mono); letter-spacing: .03em; text-transform: uppercase; } .home-registry-table td:first-child::before, .home-registry-table td:nth-child(2)::before { display: none; }
  .home-registry-table .stablecoin-dossier-heading-identity { align-items: center; gap: 8px; } .home-registry-table .stablecoin-mark--small { width: 30px; height: 30px; } .home-registry-table td:first-child a { font-size: 15px; line-height: 1.15; } .home-registry-table td:first-child small { margin-top: 1px; font-size: 12px; line-height: 1.2; } .home-registry-table .chip { padding: 2px 6px; font-size: 12px; white-space: nowrap; }
  .home-registry-evidence strong, .home-registry-evidence small { display: inline; margin: 0; } .home-registry-evidence small { font-size: 12px; } .registry-count--footer { padding: 8px 10px; } .registry-count--footer .support-cta { width: 100%; min-height: 40px; }`,
  'mobile home registry rules'
);

fs.writeFileSync(cssPath, css);
fs.rmSync('scripts/apply-home-ui-correction.mjs', { force: true });
fs.rmSync('.github/workflows/apply-home-ui-correction.yml', { force: true });

const lines = css.split('\n').length;
if (lines >= 553) throw new Error(`CSS line count remains outside contract: ${lines}`);
console.log(`Compacted public-ui.css to ${lines} lines.`);
