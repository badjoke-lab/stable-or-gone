#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/site-ui.css';
const validatorPath = 'scripts/validate-ui-v3-cleanup.mjs';
const cardPaths = ['src/components/EventIndexCard.astro', 'src/components/OrganizationIndexCard.astro'];

const block = String.raw`
/* Registry indexes */
:where(.stablecoin-index-page, .event-index-page, .organization-index-page) { width: 100%; display: grid; gap: 2.75rem; }
:where(.stablecoin-register-header, .event-index-masthead, .organization-index-masthead) { padding: .9rem 0 1.75rem; border-top: 2px solid var(--ui-text); border-bottom: 1px solid var(--ui-line); }
.stablecoin-register-header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: end; }
.stablecoin-register-header > div:first-child { display: grid; gap: .65rem; }
.stablecoin-register-header > div:first-child > p:last-child { max-width: 62ch; font-size: 1rem; line-height: 1.7; }
.stablecoin-register-count { min-width: 9rem; padding-left: 1.25rem; display: grid; justify-items: end; border-left: 1px solid var(--ui-line); }
.stablecoin-register-count strong { font-family: var(--ui-serif); font-size: 3.25rem; line-height: 1; }
.stablecoin-register-count span, .stablecoin-index-page-size { color: var(--ui-muted); font: 700 .75rem/1.3 var(--ui-mono); letter-spacing: .055em; text-transform: uppercase; }
:where(.event-index-overline, .organization-index-overline) { min-height: 42px; padding: .55rem 0; display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--ui-line-soft); }
:where(.event-index-overline, .organization-index-overline) nav { display: flex; gap: 1rem; }
:where(.event-index-title, .organization-index-title) { padding: 1.5rem 0 1.25rem; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr); gap: 2.5rem; align-items: end; }
:where(.event-index-title, .organization-index-title) > div > p { margin-bottom: .45rem; color: var(--ui-muted); font: 700 .75rem/1.3 var(--ui-mono); letter-spacing: .055em; text-transform: uppercase; }
:where(.event-index-title, .organization-index-title) > span { color: var(--ui-copy); font-size: 1rem; line-height: 1.7; }
:where(.event-index-ledger, .organization-index-ledger) { margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
:where(.event-index-ledger, .organization-index-ledger) > div { min-height: 92px; padding: .9rem 1rem; display: grid; align-content: space-between; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
:where(.event-index-ledger, .organization-index-ledger) dd { margin: 0; color: var(--ui-text); font-family: var(--ui-serif); font-size: 1.7rem; }
:where(.stablecoin-index-registry, .event-index-registry, .organization-index-registry) { margin: 0; padding: 0 0 2rem; }
:where(.stablecoin-index-section-heading, .event-index-section-heading, .organization-index-section-heading) { margin-bottom: 1.25rem; padding-top: .85rem; display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, .55fr); gap: 2rem; align-items: end; border-top: 2px solid var(--ui-text); }
:where(.stablecoin-index-section-heading, .event-index-section-heading, .organization-index-section-heading) > span { color: var(--ui-muted); font-size: .875rem; line-height: 1.6; }
:where(.stablecoin-index-toolbar, .event-index-toolbar, .organization-index-toolbar) { margin-bottom: 1rem; padding: 1rem; display: grid; grid-template-columns: minmax(260px, 1fr) minmax(200px, .35fr) auto; gap: 1rem; align-items: end; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
:where(.stablecoin-index-toolbar, .event-index-toolbar, .organization-index-toolbar) label { display: grid; gap: .4rem; color: var(--ui-muted); font-size: .8125rem; font-weight: 700; }
:where(.stablecoin-index-action, .event-index-action, .organization-index-action) { min-width: 7rem; padding-inline: 1rem; }
:where(.stablecoin-index-filter-grid, .event-index-filter-grid, .organization-index-filter-grid) { position: relative; z-index: 8; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .75rem; }
:where(.stablecoin-index-filter, .event-index-filter, .organization-index-filter) { position: relative; }
:where(.stablecoin-index-filter, .event-index-filter, .organization-index-filter) > summary { min-height: 44px; padding: .65rem .75rem; display: flex; align-items: center; justify-content: space-between; gap: .75rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-elevated); color: var(--ui-copy); cursor: pointer; list-style: none; font-size: .875rem; font-weight: 700; }
:where(.stablecoin-index-filter, .event-index-filter, .organization-index-filter) > summary::-webkit-details-marker { display: none; }
:where(.stablecoin-index-filter-options, .event-index-filter-options, .organization-index-filter-options) { position: absolute; z-index: 20; top: calc(100% + .35rem); left: 0; width: max(100%, 15rem); max-height: 22rem; overflow-y: auto; padding: .55rem; display: grid; gap: .15rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-elevated); box-shadow: 0 18px 42px rgba(0,0,0,.45); }
:where(.stablecoin-index-filter-options, .event-index-filter-options, .organization-index-filter-options) label { min-height: 40px; padding: .45rem .55rem; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .6rem; align-items: center; color: var(--ui-copy); font-size: .875rem; }
:where(.stablecoin-index-filter-options, .event-index-filter-options, .organization-index-filter-options) label:hover { background: var(--ui-surface); }
:where(.stablecoin-index-filter-options, .event-index-filter-options, .organization-index-filter-options) input { width: 1rem; min-height: 1rem; }
:where(.stablecoin-index-summary, .event-index-summary, .organization-index-summary) { min-height: 52px; margin: 1rem 0; padding: .75rem 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
:where(.stablecoin-index-active-filters, .event-index-active-filters, .organization-index-active-filters) { display: flex; flex-wrap: wrap; gap: .45rem; }
:where(.stablecoin-index-result-count, .event-index-result-count, .organization-index-result-count) { color: var(--ui-muted); font-size: .875rem; white-space: nowrap; }
:where(.stablecoin-index-table, .event-index-table, .organization-index-table) { overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); }
:where(.stablecoin-index-table, .event-index-table, .organization-index-table) table { min-width: 980px; }
:where(.stablecoin-index-cards, .event-index-cards, .organization-index-cards) { display: none; }
:where(.stablecoin-index-no-results, .event-index-no-results, .organization-index-no-results) { padding: 2rem; display: grid; gap: .75rem; justify-items: start; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.stablecoin-index-pagination { margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 1rem; }
.stablecoin-index-pagination button { padding-inline: 1rem; }
.stablecoin-index-comparison { margin-top: 2rem; padding: 1.25rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.comparison-heading { display: flex; justify-content: space-between; gap: 1.5rem; align-items: end; }
.comparison-grid { margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
:where(.stablecoin-index-card, .event-index-card, .organization-index-card) { padding: 1rem; display: grid; gap: 1rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
:where(.stablecoin-index-card h2, .event-index-card h2, .organization-index-card h2) { font-family: var(--ui-serif); font-size: 1.45rem; }
:where(.stablecoin-index-card h2, .event-index-card h2, .organization-index-card h2) a { color: var(--ui-text); text-decoration: none; }
:where(.stablecoin-index-card-heading, .event-index-card-r5-meta, .organization-index-card-r5-heading) { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.stablecoin-index-card-identity { min-width: 0; display: flex; gap: .8rem; align-items: center; }
.stablecoin-index-card-grid { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--ui-line-soft); }
.stablecoin-index-card-grid > div { padding: .75rem 0; border-bottom: 1px solid var(--ui-line-soft); }
.stablecoin-index-card-grid > div:nth-child(odd) { padding-right: .75rem; }
.stablecoin-index-card-grid > div:nth-child(even) { padding-left: .75rem; border-left: 1px solid var(--ui-line-soft); }
.stablecoin-index-card-grid dd { margin: .3rem 0 0; font-size: .9375rem; }
:where(.event-index-card-r5-subject, .event-index-card-r5-effect, .organization-index-card-r5-role, .organization-index-card-r5-relationships) { display: grid; gap: .35rem; }
:where(.event-index-card-r5-subject, .event-index-card-r5-effect, .organization-index-card-r5-role, .organization-index-card-r5-relationships) span { color: var(--ui-muted); font-size: .8125rem; }
.organization-index-card-r5-jurisdiction { color: var(--ui-muted); font-size: .875rem; }

@media (max-width: 820px) {
  .stablecoin-register-header, :where(.event-index-title, .organization-index-title), :where(.stablecoin-index-section-heading, .event-index-section-heading, .organization-index-section-heading) { grid-template-columns: 1fr; gap: 1rem; }
  .stablecoin-register-count { padding: 0; justify-items: start; border-left: 0; }
  :where(.event-index-ledger, .organization-index-ledger) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  :where(.stablecoin-index-toolbar, .event-index-toolbar, .organization-index-toolbar) { grid-template-columns: 1fr; }
  :where(.stablecoin-index-filter-options, .event-index-filter-options, .organization-index-filter-options) { position: static; width: 100%; max-height: none; box-shadow: none; }
  :where(.stablecoin-index-summary, .event-index-summary, .organization-index-summary) { align-items: flex-start; flex-direction: column; }
  :where(.stablecoin-index-table, .event-index-table, .organization-index-table) { display: none; }
  :where(.stablecoin-index-cards, .event-index-cards, .organization-index-cards) { display: grid; gap: 1rem; }
}

@media (max-width: 520px) {
  :where(.event-index-ledger, .organization-index-ledger), .stablecoin-index-card-grid { grid-template-columns: 1fr; }
  .stablecoin-index-card-grid > div:nth-child(odd), .stablecoin-index-card-grid > div:nth-child(even) { padding-inline: 0; border-left: 0; }
}
`;

let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('/* Registry indexes */')) {
  const marker = '/* Detail families */';
  if (!css.includes(marker)) throw new Error(`CSS insertion marker missing: ${marker}`);
  css = css.replace(marker, `${block}\n${marker}`);
  fs.writeFileSync(cssPath, css);
}

for (const cardPath of cardPaths) {
  const source = fs.readFileSync(cardPath, 'utf8');
  const next = source.replace(/\n?<style\s+is:global>[\s\S]*?<\/style>\s*$/m, '\n');
  if (next !== source) fs.writeFileSync(cardPath, next);
}

let validator = fs.readFileSync(validatorPath, 'utf8');
validator = validator
  .replace("'low_contrast_text'", "'low_contrast_public_text'")
  .replace("'legacy_link_hover'", "'invalid_link_hover'")
  .replace("'flattened_badge'", "'invalid_badge_contract'");
fs.writeFileSync(validatorPath, validator);
