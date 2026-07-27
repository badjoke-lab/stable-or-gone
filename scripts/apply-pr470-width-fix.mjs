#!/usr/bin/env node
import fs from 'node:fs';

// Idempotent migration: it changes only the single public stylesheet authority.
const cssPath = 'src/styles/public-ui.css';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');

const siteMainLine = '.site-main { width: min(calc(100% - 2rem), var(--ui-content)); margin: 0 auto; padding: 2.25rem 0 5rem; outline: none; }';
const containmentBlock = `${siteMainLine}

/* Horizontal containment contract */
.site-main > *, .home-ledger, .home-ledger > *, .home-recent, .stats-page, .stats-page > *, .stats-section, .stablecoin-dossier, .stablecoin-dossier > *, .stablecoin-dossier-section, .stablecoin-dossier-section > *, .panel, .registry { min-width: 0; max-width: 100%; }
pre { max-width: 100%; overflow-x: auto; white-space: pre-wrap; overflow-wrap: anywhere; }`;
css = replaceRequired(css, siteMainLine, containmentBlock, 'CSS containment');

const publicWrappingBlock = `${containmentBlock}
/* Public long-value wrapping contract */
main :where(a, dd, li) { overflow-wrap: anywhere; word-break: break-word; }`;
css = replaceRequired(css, containmentBlock, publicWrappingBlock, 'CSS public long-value wrapping');

const currentTableWrap = '.table-wrap, :where([class*="-table"]:not(table)) { max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
const containedTableWrap = '.table-wrap, .home-recent__table-wrap, .stats-table-wrap, .evidence-table-wrap, .compare-output, :where(div,section,article,details)[class*="-table"] { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-soft); }';
css = replaceRequired(css, currentTableWrap, containedTableWrap, 'CSS table wrapper');

const currentTable = 'table { width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }';
const boundedTable = `table { width: 100%; max-width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; }
table[data-table-kind] { table-layout: fixed; }
[data-table-kind="stablecoin-deployments"] { min-width: 1780px; table-layout: auto; }
[data-table-kind$="sources"] { table-layout: fixed; }`;
css = replaceRequired(css, currentTable, boundedTable, 'CSS table sizing');

const currentCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; }';
const wrappedCells = 'th, td { padding: .9rem 1rem; border-bottom: 1px solid var(--ui-line-soft); text-align: left; vertical-align: top; overflow-wrap: anywhere; word-break: normal; }';
css = replaceRequired(css, currentCells, wrappedCells, 'CSS table cells');

const currentMobileTable = 'table[data-mobile-table] { display: block; width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; }';
const boundedMobileTable = 'table[data-mobile-table] { width: 100%; min-width: 0; max-width: 100%; }';
css = replaceRequired(css, currentMobileTable, boundedMobileTable, 'CSS mobile table base');

const mobileMarker = '@media (max-width: 820px) {';
const mobileContainment = `@media (max-width: 820px) {
  /* Mobile records replace wide desktop tables without dropping fields. */
  .organization-detail-table, .stablecoin-identity-table, .stablecoin-organizations-table, .stablecoin-deployment-table-wrap, .evidence-table-wrap { display: none; }
  .stablecoin-coverage-disclosure table[data-table-kind="stablecoin-record-coverage"] { display: table; width: 100%; min-width: 0; table-layout: fixed; }
  .stats-wide-table, .stats-table-wrap table { width: 100%; min-width: 0; table-layout: fixed; }
  .stats-table-wrap { overflow: visible; }
  .home-recent__table-wrap { overflow: visible; border: 0; background: transparent; }
  .home-recent table, .home-recent tbody, .home-recent tr, .home-recent td { display: block; width: 100%; min-width: 0; }
  .home-recent thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .home-recent tbody { display: grid; gap: .75rem; }
  .home-recent tr { border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
  .home-recent td { padding: .7rem .8rem; display: grid; grid-template-columns: minmax(7.5rem,.45fr) minmax(0,1fr); gap: .7rem; border-bottom: 1px solid var(--ui-line-soft); }
  .home-recent td:last-child { border-bottom: 0; }
  .home-recent td::before { color: var(--ui-muted); font: 700 .75rem/1.4 var(--ui-mono); letter-spacing: .04em; text-transform: uppercase; }
  .home-recent td:nth-child(1)::before { content: "Record"; }
  .home-recent td:nth-child(2)::before { content: "Symbol"; }
  .home-recent td:nth-child(3)::before { content: "Lifecycle"; }
  .home-recent td:nth-child(4)::before { content: "Primary organization"; }
  .home-recent td:nth-child(5)::before { content: "Last reviewed"; }`;
if (!css.includes('/* Mobile records replace wide desktop tables without dropping fields. */')) {
  css = replaceRequired(css, mobileMarker, mobileContainment, 'CSS mobile containment');
}

fs.writeFileSync(cssPath, css);
console.log(JSON.stringify({ cssPath }, null, 2));
