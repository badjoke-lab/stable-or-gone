import fs from 'node:fs';

const path = 'src/styles/public-ui.css';
const marker = '/* Stablecoin comparison matrix remediation */';
const css = String.raw`

/* Stablecoin comparison matrix remediation */
.stablecoin-index-comparison { min-width: 0; max-width: 100%; }
.comparison-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; padding-top: 12px; border-top: 1px solid var(--ui-text); }
.comparison-heading > div:first-child { min-width: 0; }
.comparison-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 10px; }
.comparison-differences-toggle { min-height: 44px; display: inline-flex; align-items: center; gap: 8px; padding: 0 10px; border: 1px solid var(--ui-line-strong); background: var(--ui-bg); white-space: nowrap; }
.comparison-differences-toggle input { width: 1.2rem; min-height: 1.2rem; margin: 0; }
.comparison-alert:empty { display: none; }
.comparison-alert:not(:empty) { margin-top: 10px; padding: 10px 0; border-top: 1px solid var(--ui-warning); border-bottom: 1px solid var(--ui-warning); }
.comparison-matrix-shell { width: 100%; max-width: 100%; margin-top: 14px; overflow-x: auto; overscroll-behavior-x: contain; border: 1px solid var(--ui-text); background: var(--ui-bg); scrollbar-width: thin; }
.comparison-matrix-shell .comparison-matrix { display: table; width: 100%; min-width: 720px; margin: 0; border: 0; border-collapse: separate; border-spacing: 0; table-layout: auto; }
.comparison-matrix-shell .comparison-matrix[data-selected-count="3"] { min-width: 920px; }
.comparison-matrix-shell .comparison-matrix[data-selected-count="4"] { min-width: 1120px; }
.comparison-matrix th, .comparison-matrix td { min-width: 190px; padding: 10px 12px; vertical-align: top; text-align: left; border-right: 1px solid var(--ui-line); border-bottom: 1px solid var(--ui-line); overflow-wrap: anywhere; word-break: normal; }
.comparison-matrix tr > :last-child { border-right: 0; }
.comparison-matrix tbody tr:last-child > * { border-bottom: 0; }
.comparison-matrix .comparison-attribute-column { position: sticky; left: 0; z-index: 2; width: 168px; min-width: 168px; max-width: 168px; background: var(--ui-bg); color: var(--ui-text); }
.comparison-matrix thead .comparison-attribute-column { z-index: 4; background: var(--ui-bg-soft); }
.comparison-record-header { min-width: 210px; background: var(--ui-bg-soft); }
.comparison-column-header { display: grid; align-content: start; gap: 9px; }
.comparison-column-identity { min-width: 0; display: grid; gap: 2px; }
.comparison-column-identity .record-symbol { color: var(--ui-muted); font: 700 12px/1.35 var(--ui-mono); letter-spacing: .04em; text-transform: uppercase; }
.comparison-column-identity a { width: fit-content; max-width: 100%; color: var(--ui-text); font: 600 1.08rem/1.2 var(--ui-serif); overflow-wrap: anywhere; }
.comparison-remove-record { width: fit-content; min-height: 44px; padding-inline: 10px; background: transparent; color: var(--ui-text); }
.comparison-section-row th { position: static; width: auto; max-width: none; min-width: 0; padding: 8px 12px; background: var(--ui-bg-soft); color: var(--ui-muted); font: 700 12px/1.35 var(--ui-mono); letter-spacing: .04em; text-transform: uppercase; border-bottom-color: var(--ui-line-strong); }
.comparison-matrix tr[data-different="true"] > td { box-shadow: inset 3px 0 0 var(--ui-line-strong); }
.comparison-matrix td[data-value-state="unknown"], .comparison-matrix td[data-value-state="not-recorded"] { color: var(--ui-muted); font-style: italic; }
.comparison-no-differences { margin: 0; padding: 14px 12px; border-top: 1px solid var(--ui-line); color: var(--ui-muted); }
.comparison-disclaimer { margin-top: 10px; color: var(--ui-muted); font-size: 13px; }
@media (max-width: 640px) {
  .stablecoin-index-comparison { display: block; }
  .comparison-heading { align-items: stretch; flex-direction: column; gap: 12px; }
  .comparison-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .comparison-differences-toggle { width: 100%; min-width: 0; white-space: normal; }
  .comparison-actions .ui-button { width: 100%; }
  .comparison-matrix-shell { display: block; max-width: 100%; overflow-x: auto; }
  .comparison-matrix-shell .comparison-matrix { display: table; min-width: 660px; }
  .comparison-matrix-shell .comparison-matrix[data-selected-count="3"] { min-width: 860px; }
  .comparison-matrix-shell .comparison-matrix[data-selected-count="4"] { min-width: 1060px; }
  .comparison-matrix th, .comparison-matrix td { min-width: 178px; padding: 9px 10px; }
  .comparison-matrix .comparison-attribute-column { width: 126px; min-width: 126px; max-width: 126px; }
  .comparison-record-header { min-width: 178px; }
  .comparison-remove-record { width: 100%; }
}
`;

const current = fs.readFileSync(path, 'utf8');
if (!current.includes(marker)) {
  fs.writeFileSync(path, `${current.trimEnd()}${css}\n`);
  console.log('Appended stablecoin comparison matrix CSS.');
} else {
  console.log('Stablecoin comparison matrix CSS already present; no change.');
}
