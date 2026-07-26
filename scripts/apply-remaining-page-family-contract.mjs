#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/site-ui.css';
const statsPath = 'src/pages/stats/index.astro';
const runtimePaths = [
  'src/scripts/change-timeline-ui.ts',
  'src/scripts/access-regulation-explorer.ts',
  'src/scripts/compare-v1.ts'
];

const fail = (message) => { throw new Error(message); };

let stats = fs.readFileSync(statsPath, 'utf8');
if (!stats.includes("import { formatPublicLabel } from '../../utils/displayLabels';")) {
  stats = stats.replace(
    "import BaseLayout from '../../layouts/BaseLayout.astro';\n",
    "import BaseLayout from '../../layouts/BaseLayout.astro';\nimport { formatPublicLabel } from '../../utils/displayLabels';\n"
  );
}
const oldFormatLabel = `const formatLabel = (value: string) => value
  .replaceAll('_', ' ')
  .replace(/\\b\\w/g, (letter) => letter.toUpperCase());`;
if (stats.includes(oldFormatLabel)) stats = stats.replace(oldFormatLabel, "const formatLabel = (value: string) => formatPublicLabel(value);");
else if (!stats.includes('const formatLabel = (value: string) => formatPublicLabel(value);')) fail('Stats public label formatter marker missing');

const statsBarReplacements = new Map([
  [
    '<div class="stats-bar-track" aria-hidden="true"><span style={`width: ${Math.max(group.percentage, 1)}%`}></span></div>',
    '<meter class="stats-bar-meter" min="0" max="100" value={Math.max(group.percentage, 1)} aria-hidden="true"></meter>'
  ],
  [
    '<div class="stats-bar-track" aria-hidden="true"><span style={`width: ${Math.min(100, Math.max(row.percentage, 1))}%`}></span></div>',
    '<meter class="stats-bar-meter" min="0" max="100" value={Math.min(100, Math.max(row.percentage, 1))} aria-hidden="true"></meter>'
  ],
  [
    '<div class="stats-year-track" aria-hidden="true"><span style={`width: ${(row.total / maxEventYearTotal) * 100}%`}></span></div>',
    '<meter class="stats-bar-meter" min="0" max="100" value={(row.total / maxEventYearTotal) * 100} aria-hidden="true"></meter>'
  ],
  [
    '<div class="stats-year-track" aria-hidden="true"><span style={`width: ${(row.deploymentCount / maxDeploymentCount) * 100}%`}></span></div>',
    '<meter class="stats-bar-meter" min="0" max="100" value={(row.deploymentCount / maxDeploymentCount) * 100} aria-hidden="true"></meter>'
  ]
]);
for (const [before, after] of statsBarReplacements) {
  if (stats.includes(before)) stats = stats.replaceAll(before, after);
}
if (/\sstyle\s*=/.test(stats)) fail('Stats still contains an inline style attribute after meter migration');
fs.writeFileSync(statsPath, stats);

for (const runtimePath of runtimePaths) {
  let source = fs.readFileSync(runtimePath, 'utf8');
  if (!source.includes("import { formatPublicLabel } from '../utils/displayLabels';")) {
    source = `import { formatPublicLabel } from '../utils/displayLabels';\n\n${source}`;
  }
  if (runtimePath.endsWith('compare-v1.ts')) {
    source = source.replace(
      `  const humanize = (value: unknown) => String(value ?? '')
    .replaceAll('_', ' ')
    .replace(/\\b\\w/g, (character) => character.toUpperCase());`,
      `  const humanize = (value: unknown) => formatPublicLabel(String(value ?? ''), 'Not recorded');`
    );
  } else {
    source = source.replace(
      `  const humanize = (value: string | null | undefined) => String(value ?? 'not_recorded')
    .replaceAll('_', ' ')
    .replace(/\\b\\w/g, (character) => character.toUpperCase());`,
      `  const humanize = (value: string | null | undefined) => formatPublicLabel(String(value ?? 'not_recorded'), 'Not recorded');`
    );
  }
  if (source.includes(".replaceAll('_', ' ')")) fail(`${runtimePath} still contains an ad-hoc public label formatter`);
  fs.writeFileSync(runtimePath, source);
}

let css = fs.readFileSync(cssPath, 'utf8');
const block = String.raw`
/* Remaining public page families */
:where(.stats-page, .timeline-page, .compare-page, .ar-explorer, .maintenance-page, .update-feed-page) {
  width: 100%;
  display: grid;
  gap: 3rem;
}

:where(.stats-header, .timeline-masthead, .compare-masthead, .ar-masthead, .maintenance-masthead, .update-feed-masthead) {
  padding: 1rem 0 1.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(290px, .7fr);
  gap: 2.5rem;
  align-items: end;
  border-top: 2px solid var(--ui-text);
  border-bottom: 1px solid var(--ui-line);
}
:where(.stats-header, .timeline-masthead, .compare-masthead, .ar-masthead, .maintenance-masthead, .update-feed-masthead) h1 {
  margin-top: .45rem;
  max-width: 18ch;
}
:where(.stats-lead, .timeline-masthead > div > p:last-child, .compare-masthead__copy > p:last-child, .ar-masthead > div > p:last-child, .maintenance-masthead > div > p:last-child, .update-feed-masthead > div > p:last-child) {
  margin-top: 1rem;
  max-width: 64ch;
  color: var(--ui-copy);
  font-size: 1.0625rem;
  line-height: 1.75;
}
:where(.stats-kicker, .timeline-eyebrow, .compare-eyebrow, .ar-eyebrow, .maintenance-eyebrow, .update-feed-eyebrow) {
  color: var(--ui-muted);
  font: 750 .875rem/1.4 var(--ui-mono);
  letter-spacing: .055em;
  text-transform: uppercase;
}
:where(.stats-header-meta, .timeline-contract-summary, .compare-contract-summary, .ar-contract-summary, .maintenance-contract-summary, .update-feed-contract-summary) {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--ui-line);
  border-left: 1px solid var(--ui-line);
}
:where(.stats-header-meta, .timeline-contract-summary, .compare-contract-summary, .ar-contract-summary, .maintenance-contract-summary, .update-feed-contract-summary) > div {
  min-width: 0;
  min-height: 92px;
  padding: .85rem;
  display: grid;
  align-content: space-between;
  border-right: 1px solid var(--ui-line);
  border-bottom: 1px solid var(--ui-line);
}
:where(.stats-header-meta, .timeline-contract-summary, .compare-contract-summary, .ar-contract-summary, .maintenance-contract-summary, .update-feed-contract-summary) dd {
  margin: .35rem 0 0;
  color: var(--ui-text);
  font-family: var(--ui-serif);
  font-size: 1.2rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

:where(.stats-methodology-notice, .timeline-boundary, .compare-controls, .ar-boundary-note, .maintenance-boundary, .update-feed-boundary) {
  margin: 0;
  padding: 1.4rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-surface);
}
:where(.timeline-boundary, .ar-boundary-note, .maintenance-boundary, .update-feed-boundary) > h2,
.stats-methodology-notice h2 { margin-top: .35rem; }
:where(.timeline-boundary-grid, .ar-boundary-grid, .maintenance-boundary-grid, .update-feed-boundary-grid, .timeline-method-grid, .compare-method-grid, .ar-method-grid, .maintenance-related-grid, .update-feed-actions) {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
:where(.timeline-boundary-grid, .ar-boundary-grid) p,
:where(.maintenance-boundary-grid, .update-feed-boundary-grid, .timeline-method-grid, .compare-method-grid, .ar-method-grid) article,
:where(.maintenance-related-grid, .update-feed-actions) a {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-bg-elevated);
}
:where(.timeline-boundary-grid, .ar-boundary-grid) p { display: grid; gap: .45rem; }
:where(.timeline-boundary-grid, .ar-boundary-grid) span,
:where(.maintenance-related-grid, .update-feed-actions) span { color: var(--ui-muted); font-size: .9375rem; line-height: 1.6; }

:where(.timeline-controls, .compare-controls, .ar-controls, .update-feed-controls) {
  margin: 0;
  padding: 1.4rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-surface);
}
:where(.timeline-section-heading, .compare-section-heading, .ar-section-heading, .maintenance-section-heading, .update-feed-section-heading, .stats-section-heading, .timeline-results-heading, .ar-results-heading, .update-feed-results-heading) {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: end;
}
:where(.timeline-section-heading, .compare-section-heading, .ar-section-heading, .maintenance-section-heading, .update-feed-section-heading, .stats-section-heading, .timeline-results-heading, .ar-results-heading, .update-feed-results-heading) h2 {
  margin-top: .3rem;
}
:where(.timeline-section-heading, .compare-section-heading, .ar-section-heading, .maintenance-section-heading, .update-feed-section-heading, .stats-section-heading) > div > p:last-child,
:where(.timeline-machine-link, .compare-projection-note, .ar-machine-link, .maintenance-machine-link, .update-feed-machine-link) {
  max-width: 55ch;
  color: var(--ui-muted);
  font-size: .9375rem;
  line-height: 1.6;
}
:where(.timeline-search-row, .ar-search-row, .update-feed-search-row) {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto auto minmax(0, auto);
  gap: .75rem;
  align-items: end;
}
:where(.timeline-search-field, .ar-search-field, .update-feed-search-field, .compare-slot, .timeline-filter-control, .ar-filter-control, .update-feed-filter-control) {
  display: grid;
  gap: .4rem;
  color: var(--ui-muted);
  font-size: .875rem;
  font-weight: 700;
}
:where(.timeline-filter-groups, .ar-filter-groups, .update-feed-filter-grid, .compare-slot-grid) {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: .75rem;
}
:where(.timeline-filter-group, .ar-filter-group, .compare-group-filter) {
  min-width: 0;
  margin: 0;
  padding: .8rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-bg-elevated);
}
:where(.timeline-filter-group, .ar-filter-group, .compare-group-filter) legend {
  padding: 0 .35rem;
  color: var(--ui-text);
  font-weight: 750;
}
:where(.timeline-filter-group, .ar-filter-group) > div { display: grid; gap: .65rem; }
:where(.timeline-active-filters, .ar-active-filters, .update-feed-active-filters, .compare-actions) {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  align-items: center;
}
:where(.timeline-active-filter, .ar-active-filter) {
  padding: .35rem .65rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius-pill);
  background: var(--ui-surface-strong);
  color: var(--ui-copy);
  font-size: .875rem;
}
:where(.timeline-alert, .ar-alert, .update-feed-alert, .compare-alert) {
  min-height: 1.5rem;
  margin-top: .75rem;
  color: var(--ui-danger);
  font-weight: 700;
}

:where(.timeline-results-section, .ar-results-section, .update-feed-results-section, .compare-matrix-section, .maintenance-ledger, .stats-section, .timeline-method, .compare-method-note, .ar-method-note, .maintenance-related, .update-feed-maintenance) {
  margin: 0;
  padding-top: 1rem;
  border-top: 2px solid var(--ui-text);
}
:where(.timeline-loading, .timeline-empty, .ar-loading, .ar-empty, .update-feed-empty, .compare-empty) {
  margin-top: 1.25rem;
  padding: 1.25rem;
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-surface);
}
:where(.timeline-results, .ar-results, .update-feed-results) { margin-top: 1.25rem; display: grid; gap: 1rem; }
:where(.timeline-show-more-row, .ar-show-more-row, .update-feed-show-more-row) { margin-top: 1.25rem; display: flex; justify-content: center; }
:where(.timeline-disclaimer, .compare-disclaimer, .ar-disclaimer) {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ui-line);
  color: var(--ui-muted);
  font-size: .9375rem;
}

/* Timeline */
.timeline-item {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  border: 1px solid var(--ui-line);
  border-radius: var(--ui-radius);
  background: var(--ui-surface);
}
.timeline-item__date {
  padding: 1rem;
  display: grid;
  align-content: start;
  gap: .35rem;
  border-right: 1px solid var(--ui-line);
  color: var(--ui-muted);
  font: 750 .875rem/1.45 var(--ui-mono);
}
.timeline-item__content { min-width: 0; padding: 1rem 1.15rem; }
.timeline-item__content h3 { margin-top: .85rem; font-family: var(--ui-serif); font-size: 1.45rem; }
.timeline-item__summary { margin-top: .65rem; }
.timeline-badge-row,
.timeline-subject-links { display: flex; flex-wrap: wrap; gap: .45rem; }
.timeline-subject-links { margin-top: .8rem; }
.timeline-subject-links > * { padding: .3rem .55rem; border: 1px solid var(--ui-line-soft); border-radius: var(--ui-radius); }
.timeline-item-details { margin-top: 1rem; border-top: 1px solid var(--ui-line); }
.timeline-item-details > summary { padding: .8rem 0; cursor: pointer; color: var(--ui-link); font-weight: 750; }
.timeline-item-metadata { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--ui-line-soft); }
.timeline-item-metadata > div { padding: .75rem 0; border-bottom: 1px solid var(--ui-line-soft); }
.timeline-item-metadata > div:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--ui-line-soft); }
.timeline-item-metadata dd { margin: .3rem 0 0; font-size: .9375rem; }

/* Compare */
.compare-preset-panel { margin-top: 1.25rem; padding: 1rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-elevated); }
.compare-preset-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: end; }
.compare-preset-grid { margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: .75rem; }
.compare-preset { min-height: 120px; padding: 1rem; display: grid; gap: .45rem; align-content: start; text-align: left; }
.compare-preset[aria-pressed="true"] { border-color: var(--ui-link); background: color-mix(in srgb, var(--ui-link) 12%, var(--ui-surface)); }
.compare-preset span,
.compare-preset small { color: var(--ui-muted); }
.compare-group-filter { margin-top: 1rem; }
.compare-group-filter__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: .75rem; }
.compare-group-toggle { min-height: 72px; padding: .75rem; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .65rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); }
.compare-group-toggle input { width: 1rem; min-height: 1rem; }
.compare-group-toggle span { display: grid; gap: .25rem; }
.compare-selection-status,
.compare-preset-status { margin-top: .75rem; color: var(--ui-muted); }
.compare-output { margin-top: 1.25rem; overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); }
.compare-column-header,
.compare-facet-row { min-width: 900px; display: grid; grid-template-columns: minmax(220px, .75fr) repeat(var(--compare-columns, 2), minmax(240px, 1fr)); }
.compare-column-header { position: sticky; top: 124px; z-index: 5; background: var(--ui-bg-elevated); border-bottom: 1px solid var(--ui-line); }
.compare-column-header > *,
.compare-facet-row > * { min-width: 0; padding: 1rem; border-right: 1px solid var(--ui-line); }
.compare-facet-column-heading { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); text-transform: uppercase; }
.compare-asset-header h3 { margin-top: .25rem; font-family: var(--ui-serif); }
.compare-asset-symbol { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); }
.compare-facet-group + .compare-facet-group { border-top: 2px solid var(--ui-text); }
.compare-group-heading { padding: 1rem; background: var(--ui-surface); border-bottom: 1px solid var(--ui-line); }
.compare-group-heading > span { color: var(--ui-muted); font: 750 .8125rem/1.4 var(--ui-mono); text-transform: uppercase; }
.compare-group-heading h3 { margin-top: .25rem; font-family: var(--ui-serif); font-size: 1.45rem; }
.compare-facet-row { border-bottom: 1px solid var(--ui-line); }
.compare-facet-label h4 { color: var(--ui-text); font-size: 1rem; }
.compare-facet-label p { margin-top: .4rem; color: var(--ui-muted); font-size: .875rem; }
.compare-value-cell { background: var(--ui-bg-elevated); }
.compare-cell-asset { display: none; }
.compare-value-summary { color: var(--ui-text); font-weight: 700; }
.compare-badges { margin-top: .65rem; display: flex; flex-wrap: wrap; gap: .4rem; }
.compare-freshness-meta { margin-top: .6rem; color: var(--ui-muted); font-size: .875rem; }
.compare-value-details { margin-top: .75rem; border-top: 1px solid var(--ui-line-soft); }
.compare-value-details > summary { padding: .7rem 0; cursor: pointer; color: var(--ui-link); font-weight: 700; }
.compare-structured-list { margin: 0; }
.compare-structured-list > div { padding: .55rem 0; border-bottom: 1px solid var(--ui-line-soft); }
.compare-structured-list dd { margin: .25rem 0 0; font-size: .875rem; }
.compare-record-list { padding-left: 1.25rem; }

/* Access and regulation */
.ar-filter-help,
.ar-freshness-meta { margin-top: .45rem; color: var(--ui-muted); font-size: .875rem; }
.ar-result-card { border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.ar-result-card__header { padding: 1rem 1.15rem; display: flex; justify-content: space-between; gap: 1rem; align-items: start; border-bottom: 1px solid var(--ui-line); }
.ar-result-card__header > div > span { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); }
.ar-result-card__header h2 { margin-top: .2rem; font-size: 1.8rem; }
.ar-result-card__header h2 a { color: var(--ui-text); text-decoration: none; }
.ar-lifecycle,
.ar-chip { padding: .3rem .6rem; display: inline-flex; border: 1px solid var(--ui-line); border-radius: var(--ui-radius-pill); background: var(--ui-surface-strong); color: var(--ui-copy); font-size: .875rem; }
.ar-card-layers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.ar-card-layer { min-width: 0; margin: 0; padding: 1rem; border-right: 1px solid var(--ui-line); }
.ar-card-layer:last-child { border-right: 0; }
.ar-card-layer h3 { font-family: var(--ui-serif); font-size: 1.25rem; }
.ar-layer-summary { margin-top: .45rem; color: var(--ui-text); font-weight: 700; }
.ar-state-badges,
.ar-chip-list { margin-top: .65rem; display: flex; flex-wrap: wrap; gap: .4rem; }
.ar-layer-details { margin-top: .85rem; border-top: 1px solid var(--ui-line-soft); }
.ar-layer-details > summary { padding: .75rem 0; cursor: pointer; color: var(--ui-link); font-weight: 700; }
.ar-detail-list { margin: 0; }
.ar-detail-list > div { padding: .55rem 0; border-bottom: 1px solid var(--ui-line-soft); }
.ar-detail-list dd { margin: .25rem 0 0; font-size: .875rem; }
.ar-detail-label { margin-top: .75rem; color: var(--ui-muted); font-size: .875rem; font-weight: 700; }
.ar-record-list { padding-left: 1.25rem; }
.ar-record-list li + li { margin-top: .75rem; }
.ar-record-list small { display: block; margin-top: .25rem; }

/* Maintenance */
.maintenance-entry-list { margin-top: 1.25rem; display: grid; gap: 1.25rem; }
.maintenance-entry { padding: 1.25rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.maintenance-entry__header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: start; }
.maintenance-entry__month { color: var(--ui-muted); font: 750 .875rem/1.4 var(--ui-mono); }
.maintenance-entry__header h3 { margin-top: .25rem; font-family: var(--ui-serif); font-size: 1.55rem; }
.maintenance-entry__header > div > p:last-child { margin-top: .6rem; }
.maintenance-entry__header > dl { margin: 0; min-width: 14rem; }
.maintenance-entry__header > dl > div { padding: .6rem 0; display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--ui-line-soft); }
.maintenance-entry__header dd { margin: 0; }
:where(.maintenance-checks, .maintenance-counts, .maintenance-releases, .maintenance-next-focus) { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--ui-line); }
:where(.maintenance-checks, .maintenance-counts, .maintenance-releases, .maintenance-next-focus) h4 { color: var(--ui-text); font-size: 1rem; }
.maintenance-check-grid { margin-top: .75rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: .75rem; }
.maintenance-check { padding: .85rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-bg-elevated); }
.maintenance-check[data-result="pass"],
.maintenance-check[data-result="success"] { border-color: color-mix(in srgb, var(--ui-positive) 65%, var(--ui-line)); background: color-mix(in srgb, var(--ui-positive) 8%, var(--ui-bg-elevated)); }
.maintenance-check[data-result="fail"],
.maintenance-check[data-result="error"] { border-color: color-mix(in srgb, var(--ui-danger) 65%, var(--ui-line)); background: color-mix(in srgb, var(--ui-danger) 8%, var(--ui-bg-elevated)); }
.maintenance-check > span { color: var(--ui-muted); font: 750 .8125rem/1.35 var(--ui-mono); text-transform: uppercase; }
.maintenance-check strong { display: block; margin-top: .35rem; }
.maintenance-check p { margin-top: .45rem; font-size: .875rem; }
.maintenance-counts dl { margin: .75rem 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
.maintenance-counts dl > div { padding: .75rem; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
.maintenance-counts dd { margin: .3rem 0 0; color: var(--ui-text); font-family: var(--ui-serif); font-size: 1.35rem; }
.maintenance-releases > div { margin-top: .75rem; display: flex; flex-wrap: wrap; gap: .5rem; }
.maintenance-releases a { padding: .45rem .7rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); }
.maintenance-next-focus ol { margin-bottom: 0; }
.maintenance-related-grid a { display: grid; gap: .35rem; text-decoration: none; }

/* Update feed */
.update-feed-filter-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.update-feed-item { display: grid; grid-template-columns: 10rem minmax(0, 1fr); border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.update-feed-item__date { padding: 1rem; display: grid; align-content: start; gap: .35rem; border-right: 1px solid var(--ui-line); color: var(--ui-muted); font: 750 .875rem/1.45 var(--ui-mono); }
.update-feed-item__content { min-width: 0; padding: 1rem 1.15rem; }
.update-feed-item__meta { display: flex; flex-wrap: wrap; gap: .5rem; color: var(--ui-muted); font-size: .875rem; }
.update-feed-category { padding: .3rem .6rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius-pill); background: var(--ui-surface-strong); color: var(--ui-copy); }
.update-feed-item h3 { margin-top: .75rem; font-family: var(--ui-serif); font-size: 1.45rem; }
.update-feed-item__content > p { margin-top: .6rem; }
.update-feed-paths { margin-top: .8rem; display: flex; flex-wrap: wrap; gap: .45rem; }
.update-feed-paths a { padding: .3rem .55rem; border: 1px solid var(--ui-line-soft); border-radius: var(--ui-radius); font-family: var(--ui-mono); font-size: .8125rem; }
.update-feed-details { margin-top: .85rem; border-top: 1px solid var(--ui-line); }
.update-feed-details > summary { padding: .75rem 0; cursor: pointer; color: var(--ui-link); font-weight: 700; }
.update-feed-details dl { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.update-feed-details dl > div { padding: .65rem 0; border-bottom: 1px solid var(--ui-line-soft); }
.update-feed-details dl > div:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--ui-line-soft); }
.update-feed-details dd { margin: .25rem 0 0; font-size: .875rem; }
.update-feed-actions a { display: grid; gap: .35rem; text-decoration: none; }

/* Statistics */
.stats-methodology-notice { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, .7fr) auto; gap: 1.5rem; align-items: center; }
.stats-section { padding-bottom: 2rem; border-bottom: 1px solid var(--ui-line); }
.stats-kpi-grid,
.stats-mini-kpi-grid { margin: 1.25rem 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); border-top: 1px solid var(--ui-line); border-left: 1px solid var(--ui-line); }
.stats-kpi-grid > div,
.stats-mini-kpi-grid > div { min-height: 118px; padding: .9rem; display: grid; align-content: space-between; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); }
.stats-kpi-grid dd,
.stats-mini-kpi-grid dd { margin: .3rem 0; color: var(--ui-text); font-family: var(--ui-serif); font-size: 2rem; }
.stats-kpi-grid p { color: var(--ui-muted); font-size: .875rem; }
.stats-lifecycle-layout,
.stats-analysis-grid { margin-top: 1.25rem; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.stats-analysis-grid--three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.stats-analysis-panel { margin: 0; padding: 1rem; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); background: var(--ui-surface); }
.stats-analysis-panel > h3 { font-family: var(--ui-serif); font-size: 1.35rem; }
.stats-analysis-panel > p { margin-top: .45rem; color: var(--ui-muted); font-size: .875rem; }
.stats-bar-list,
.stats-compact-bars,
.stats-year-list,
.stats-chain-list { display: grid; gap: .85rem; }
.stats-bar-row,
.stats-compact-bar { display: grid; gap: .35rem; }
.stats-bar-row__label,
.stats-compact-bar > div:first-child,
.stats-chain-row > div:first-child { display: flex; justify-content: space-between; gap: 1rem; }
.stats-bar-meter { width: 100%; height: .75rem; border: 0; background: var(--ui-bg-elevated); }
.stats-bar-meter::-webkit-meter-bar { border: 1px solid var(--ui-line); border-radius: var(--ui-radius-pill); background: var(--ui-bg-elevated); }
.stats-bar-meter::-webkit-meter-optimum-value { border-radius: var(--ui-radius-pill); background: var(--ui-link); }
.stats-bar-meter::-moz-meter-bar { border-radius: var(--ui-radius-pill); background: var(--ui-link); }
.stats-bar-row p,
.stats-compact-bar small { color: var(--ui-muted); font-size: .875rem; }
.stats-table-wrap { overflow-x: auto; border: 1px solid var(--ui-line); border-radius: var(--ui-radius); }
.stats-year-row,
.stats-chain-row { display: grid; grid-template-columns: 6rem minmax(0, 1fr) 3rem; gap: .75rem; align-items: center; }
.stats-chain-row { grid-template-columns: minmax(9rem, .5fr) minmax(0, 1fr) 3rem; }
.stats-chain-row > div:first-child { display: grid; }
.stats-chain-row span { color: var(--ui-muted); font-size: .875rem; }
.stats-metric-list { margin: .75rem 0 0; }
.stats-metric-list > div { padding: .65rem 0; display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--ui-line-soft); }
.stats-metric-list dd { margin: 0; color: var(--ui-text); font-weight: 750; }
.stats-failure-header { margin-top: 1.5rem; padding: 1rem; display: flex; justify-content: space-between; gap: 2rem; align-items: end; border: 1px solid var(--ui-line); background: var(--ui-bg-elevated); }
.stats-failure-header h3 { margin-top: .25rem; font-family: var(--ui-serif); font-size: 1.5rem; }
.stats-wide-table { min-width: 720px; }

@media (max-width: 920px) {
  :where(.stats-header, .timeline-masthead, .compare-masthead, .ar-masthead, .maintenance-masthead, .update-feed-masthead),
  .stats-methodology-notice { grid-template-columns: 1fr; }
  :where(.timeline-search-row, .ar-search-row, .update-feed-search-row) { grid-template-columns: 1fr 1fr; }
  .ar-card-layers,
  .stats-analysis-grid--three { grid-template-columns: 1fr; }
  .ar-card-layer { border-right: 0; border-bottom: 1px solid var(--ui-line); }
  .ar-card-layer:last-child { border-bottom: 0; }
}

@media (max-width: 720px) {
  :where(.timeline-boundary-grid, .ar-boundary-grid, .maintenance-boundary-grid, .update-feed-boundary-grid, .timeline-method-grid, .compare-method-grid, .ar-method-grid, .maintenance-related-grid, .update-feed-actions),
  .stats-lifecycle-layout,
  .stats-analysis-grid,
  .update-feed-filter-grid { grid-template-columns: 1fr; }
  :where(.timeline-section-heading, .compare-section-heading, .ar-section-heading, .maintenance-section-heading, .update-feed-section-heading, .stats-section-heading, .timeline-results-heading, .ar-results-heading, .update-feed-results-heading),
  .compare-preset-heading,
  .stats-failure-header { align-items: flex-start; flex-direction: column; }
  :where(.timeline-search-row, .ar-search-row, .update-feed-search-row) { grid-template-columns: 1fr; }
  .timeline-item,
  .update-feed-item { grid-template-columns: 1fr; }
  .timeline-item__date,
  .update-feed-item__date { border-right: 0; border-bottom: 1px solid var(--ui-line); }
  .timeline-item-metadata,
  .update-feed-details dl { grid-template-columns: 1fr; }
  .timeline-item-metadata > div:nth-child(even),
  .update-feed-details dl > div:nth-child(even) { padding-left: 0; border-left: 0; }
  .maintenance-entry__header { grid-template-columns: 1fr; }
  .maintenance-entry__header > dl { min-width: 0; }
}
`;

const marker = '/* Static registry pagination */';
if (!css.includes(marker)) fail('Single UI insertion marker missing');
if (!css.includes('/* Remaining public page families */')) css = css.replace(marker, `${block}\n${marker}`);
fs.writeFileSync(cssPath, css);

const staleTrigger = 'artifacts/trigger-remaining-page-family-contract.txt';
if (fs.existsSync(staleTrigger)) fs.rmSync(staleTrigger);
console.log(JSON.stringify({ stats: statsPath, runtimes: runtimePaths, css: cssPath }, null, 2));
