import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const css = read('src/styles/public-ui.css');
const brand = read('src/components/BrandLockup.astro');
const layout = read('src/layouts/BaseLayout.astro');
const home = read('src/pages/index.astro');
const catalog = read('src/data/guideCatalog.ts');
const spec = read('docs/quality/guide-readability-remediation-2026-08-08-spec.md');
const authority = readJson('config/post-pr531-authority-reconciliation.json');
const marketAccess = readJson('data/market-access-records-v1.json');

const baseImport = "import '../styles/public-ui.css';";
expect(brand.includes(baseImport), 'base public UI stylesheet import missing');
expect(!brand.includes('guide-readability-remediation.css'), 'Guide remediation must be folded into public-ui.css, not loaded as a second stylesheet');
expect(css.includes('/* Guide & Research Surface Readability Remediation — 2026-08-08 */'), 'folded Guide remediation marker missing from public-ui.css');

expect(css.includes('.guide-article-layout'), 'Guide shared layout rule missing');
expect(css.includes('grid-template-columns: minmax(0, 1fr);'), 'persistent two-column Guide layout not removed');
expect(css.includes('width: min(100%, 1120px);'), 'Guide data width ceiling is not 1120px');
expect(css.includes('.guide-article-toc ol'), 'full-width Guide TOC rule missing');
expect(css.includes('grid-template-columns: repeat(3, minmax(0, 1fr));'), 'desktop Guide TOC or research grid does not use balanced columns');
expect(css.includes('.guide-article-content > section.panel'), 'direct Guide panel neutralization missing');
expect(css.includes('border-right: 0;') && css.includes('border-left: 0;'), 'Guide direct sections still retain four-sided panel borders');
expect(css.includes('.guide-article-content > section > h2.bar'), 'Guide primary section heading override missing');
expect(css.includes('font: 600 1.55rem/1.16 var(--ui-serif);'), 'desktop Guide primary heading floor/style changed');
expect(css.includes('font-size: 1.375rem;'), 'mobile Guide primary heading floor changed');
expect(css.includes('max-width: 76ch;'), 'Guide prose measure limit missing');
expect(css.includes('.guide-article-content th') && css.includes('.guide-article-content td'), 'Guide table readability rules missing');
expect(css.includes('body:has(main[data-page-kind="guide-article"]) .site-footer > .footer-support'), 'duplicate Guide footer-support suppression missing');
expect(css.includes('body:has(main[data-page-kind="longform"]) .site-footer > .footer-support'), 'duplicate long-form footer-support suppression missing');
expect(css.includes('.guide-article-layout > .context-support-callout'), 'Guide contextual support width rule missing');
expect(css.includes('section:has(#research-guides-title) > .editorial-directory'), 'home Research & Guides scoped composition rule missing');
expect(css.includes('@media (max-width: 980px)') && css.includes('grid-template-columns: 1fr;'), 'balanced narrow-screen research stack missing');

expect(layout.includes('class="guide-article-layout"'), 'Guide shared layout wrapper missing');
expect(layout.includes('class="guide-article-toc"'), 'Guide TOC wrapper missing');
expect(layout.includes('class="context-support-callout"'), 'Guide contextual support callout missing');
expect(home.includes('id="research-guides-title"'), 'home Research & Guides anchor missing');
expect(/featuredGuides\.find\(\(guide\) => guide\.slug === ['"]global-stablecoin-regulation-2026['"]\)/.test(home), 'global 2026 Guide is no longer explicitly selected as the home lead');
expect(/slug:\s*['"]global-stablecoin-regulation-2026['"][\s\S]{0,900}?featured:\s*true/.test(catalog), 'global 2026 Guide is no longer a featured catalog entry');

expect(fs.existsSync(path.join(root, 'src/pages/guides/global-stablecoin-regulation-2026/index.astro')), 'global 2026 Guide route missing');
expect(fs.existsSync(path.join(root, 'src/pages/guides/uk-stablecoin-capital-rules-2026/index.astro')), 'UK Guide acceptance route missing');
expect(spec.includes('Do not use a persistent desktop left rail'), 'Guide spec no-left-rail contract missing');
expect(spec.includes('Automated checks are necessary but not sufficient.'), 'Guide spec direct visual inspection gate missing');
expect(spec.includes('No horizontal page overflow is allowed.'), 'Guide overflow prohibition missing');

expect(authority.immediate_authority.work_item === 'guide_and_research_surface_readability_remediation', 'active authority no longer points to Guide remediation');
expect(authority.immediate_authority.canonical_changes_allowed === false, 'Guide remediation unexpectedly allows canonical changes');
expect(authority.immediate_authority.guide_claim_changes_allowed === false, 'Guide remediation unexpectedly allows factual Guide claim changes');
expect(Array.isArray(marketAccess) && marketAccess.length === 8, 'Market Access changed inside Guide presentation remediation');
expect(marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'paused JPYSC implementation leaked into Guide remediation');

if (failures.length) {
  console.error('Guide readability remediation validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  work_item: 'guide_and_research_surface_readability_remediation',
  guide_layout: 'single_column_1120px_max',
  toc: 'full_width_responsive_grid',
  section_hierarchy: 'serif_h2_24px_desktop_22px_mobile',
  duplicate_footer_support: 'suppressed_for_guide_and_longform',
  home_research_secondary_layout: 'three_columns_then_single_stack',
  home_lead_guide: 'global-stablecoin-regulation-2026',
  canonical_changes: 0,
  market_access_records: 8,
  visual_review_still_required: true
}, null, 2));
