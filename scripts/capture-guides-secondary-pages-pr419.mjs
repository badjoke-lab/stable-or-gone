import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const baseUrl = String(process.env.SOG_SCREENSHOT_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputRoot = path.join(root, 'artifacts/pr419-guides-secondary-pages');
fs.rmSync(outputRoot, { recursive:true, force:true });
fs.mkdirSync(outputRoot, { recursive:true });

const desktop = { width:1440, height:1000 };
const mobile = { width:390, height:844 };
const states = [
  { id:'guides-desktop', kind:'guide-index', route:'/guides/', viewport:desktop },
  { id:'guides-mobile', kind:'guide-index', route:'/guides/', viewport:mobile },
  { id:'guide-mica-desktop', kind:'guide-article', route:'/guides/eu-stablecoin-access-after-mica/', viewport:desktop },
  { id:'guide-mica-mobile', kind:'guide-article', route:'/guides/eu-stablecoin-access-after-mica/', viewport:mobile },
  { id:'methodology-desktop', kind:'longform', route:'/methodology/', viewport:desktop },
  { id:'methodology-mobile', kind:'longform', route:'/methodology/', viewport:mobile },
  { id:'about-desktop', kind:'longform', route:'/about/', viewport:desktop },
  { id:'about-mobile', kind:'longform', route:'/about/', viewport:mobile },
  { id:'compare-desktop', kind:'compare', route:'/compare/', viewport:desktop },
  { id:'compare-mobile', kind:'compare', route:'/compare/', viewport:mobile },
  { id:'access-regulation-desktop', kind:'access', route:'/access-regulation/', viewport:desktop },
  { id:'access-regulation-mobile', kind:'access', route:'/access-regulation/', viewport:mobile },
  { id:'timeline-desktop', kind:'timeline', route:'/timeline/', viewport:desktop },
  { id:'timeline-mobile', kind:'timeline', route:'/timeline/', viewport:mobile },
  { id:'stats-desktop', kind:'stats', route:'/stats/', viewport:desktop },
  { id:'stats-mobile', kind:'stats', route:'/stats/', viewport:mobile }
];

const browser = await chromium.launch({ headless:true });
const records = [];
const failures = [];
try {
  for (const state of states) {
    const context = await browser.newContext({ viewport:state.viewport, deviceScaleFactor:1, reducedMotion:'reduce' });
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${state.route}`, { waitUntil:'networkidle', timeout:60_000 });
    if (!response?.ok()) { failures.push(`${state.id}: HTTP ${response?.status() ?? 'no response'}`); await context.close(); continue; }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const metrics = await page.evaluate((kind) => {
      const body = document.body;
      const html = document.documentElement;
      const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
      const h1 = document.querySelector('h1');
      const sectionCount = document.querySelectorAll('main section').length;
      const localScrollable = [...document.querySelectorAll('main *')].filter((node) => {
        if (!(node instanceof HTMLElement)) return false;
        const style = getComputedStyle(node);
        return ['auto','scroll'].includes(style.overflowX) && node.scrollWidth >= node.clientWidth;
      }).length;
      const common = {
        shellPresent: Boolean(document.querySelector('[data-shell="evidence-registry-pr411"]')),
        horizontalOverflow: scrollWidth > html.clientWidth + 1,
        viewportWidth: html.clientWidth,
        scrollWidth,
        bodyHeight: body.scrollHeight,
        title: h1?.textContent?.trim() ?? '',
        h1FontSize: h1 ? Number.parseFloat(getComputedStyle(h1).fontSize) : 0,
        sectionCount,
        localScrollable
      };
      if (kind === 'guide-index') return {
        ...common,
        marker:Boolean(document.querySelector('[data-secondary-version="pr419-guides"]')),
        categoryNav:Boolean(document.querySelector('.guide-index-nav')),
        categoryLinks:document.querySelectorAll('.guide-index-nav a').length,
        sections:document.querySelectorAll('.guide-index-section').length,
        desktopTable:Boolean(document.querySelector('.guide-index-table table')),
        mobileRecords:document.querySelectorAll('.guide-index-mobile article').length,
        referenceLinks:document.querySelectorAll('.guide-index-reference a').length
      };
      if (kind === 'guide-article') return {
        ...common,
        marker:Boolean(document.querySelector('[data-secondary-version="pr419-guide-article"]')),
        toc:Boolean(document.querySelector('[data-guide-toc]')),
        tocLinks:document.querySelectorAll('[data-guide-toc-list] a').length,
        articleSections:document.querySelectorAll('.guide-article-content > section').length,
        tables:document.querySelectorAll('.guide-article-content table').length,
        footerLinks:document.querySelectorAll('.guide-article-footer a').length,
        metadataItems:document.querySelectorAll('.guide-article-meta > div').length
      };
      if (kind === 'longform') return {
        ...common,
        marker:Boolean(document.querySelector('[data-secondary-version="pr419-editorial"]')),
        toc:Boolean(document.querySelector('[data-longform-toc]')),
        tocLinks:document.querySelectorAll('[data-longform-toc-list] a').length,
        longformSections:document.querySelectorAll('.longform-content > section').length,
        tables:document.querySelectorAll('.longform-content table').length,
        footerLinks:document.querySelectorAll('.longform-footer a').length
      };
      if (kind === 'compare') return {
        ...common,
        marker:Boolean(document.querySelector('[data-compare-page]')),
        inputs:document.querySelectorAll('[data-compare-slot]').length,
        presets:document.querySelectorAll('[data-compare-preset-id]').length,
        clear:Boolean(document.querySelector('[data-compare-clear]')),
        status:Boolean(document.querySelector('[data-compare-status]')),
        empty:Boolean(document.querySelector('[data-compare-empty]')),
        output:Boolean(document.querySelector('[data-compare-output]')),
        projection:Boolean(document.querySelector('a[href="/data/comparison.json"]'))
      };
      if (kind === 'access') return {
        ...common,
        marker:Boolean(document.querySelector('[data-ar-explorer]')),
        search:Boolean(document.querySelector('[data-ar-search]')),
        clear:Boolean(document.querySelector('[data-ar-clear]')),
        copy:Boolean(document.querySelector('[data-ar-copy]')),
        filters:document.querySelectorAll('[data-ar-filter-slot]').length,
        results:Boolean(document.querySelector('.ar-results-section')),
        projection:Boolean(document.querySelector('a[href="/data/access-regulation-index.json"]'))
      };
      if (kind === 'timeline') return {
        ...common,
        marker:Boolean(document.querySelector('[data-timeline-page]')),
        search:Boolean(document.querySelector('[data-timeline-search]')),
        clear:Boolean(document.querySelector('[data-timeline-clear]')),
        copy:Boolean(document.querySelector('[data-timeline-copy]')),
        filters:document.querySelectorAll('[data-timeline-filter-slot]').length,
        results:Boolean(document.querySelector('.timeline-results-section')),
        projection:Boolean(document.querySelector('a[href="/data/change-timeline.json"]'))
      };
      return {
        ...common,
        marker:Boolean(document.querySelector('[data-stats-foundation]')),
        methodology:Boolean(document.querySelector('.stats-methodology-notice')),
        kpis:document.querySelectorAll('.stats-kpi').length,
        sections:document.querySelectorAll('.stats-section').length,
        tables:document.querySelectorAll('.stats-table-wrap table').length,
        methodologyLink:Boolean(document.querySelector('a[href="/methodology/"]'))
      };
    }, state.kind);

    if (!metrics.shellPresent) failures.push(`${state.id}: shared shell missing`);
    if (!metrics.marker) failures.push(`${state.id}: required page marker missing`);
    if (!metrics.title) failures.push(`${state.id}: h1 missing`);
    if (metrics.h1FontSize < 28) failures.push(`${state.id}: h1 is too small (${metrics.h1FontSize}px)`);
    if (metrics.horizontalOverflow) failures.push(`${state.id}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.viewportWidth}px`);
    if (state.kind === 'guide-index') {
      if (!metrics.categoryNav || metrics.categoryLinks < 3 || metrics.sections < 3) failures.push(`${state.id}: guide archive navigation or sections incomplete`);
      if (!metrics.desktopTable || metrics.mobileRecords < 1 || metrics.referenceLinks < 3) failures.push(`${state.id}: guide archive representations incomplete`);
    } else if (state.kind === 'guide-article') {
      if (!metrics.toc || metrics.tocLinks < 5 || metrics.articleSections < 5) failures.push(`${state.id}: guide table of contents or sections incomplete`);
      if (metrics.tables < 1 || metrics.footerLinks < 4 || metrics.metadataItems < 3) failures.push(`${state.id}: guide tables, metadata, or reference footer incomplete`);
    } else if (state.kind === 'longform') {
      if (!metrics.toc || metrics.tocLinks < 2 || metrics.longformSections < 3 || metrics.footerLinks < 4) failures.push(`${state.id}: longform navigation or sections incomplete`);
    } else if (state.kind === 'compare') {
      if (metrics.inputs !== 4 || metrics.presets < 1 || !metrics.clear || !metrics.status || !metrics.empty || !metrics.output || !metrics.projection) failures.push(`${state.id}: comparison state surfaces incomplete`);
    } else if (state.kind === 'access') {
      if (!metrics.search || !metrics.clear || !metrics.copy || metrics.filters < 4 || !metrics.results || !metrics.projection) failures.push(`${state.id}: access/regulation state surfaces incomplete`);
    } else if (state.kind === 'timeline') {
      if (!metrics.search || !metrics.clear || !metrics.copy || metrics.filters < 5 || !metrics.results || !metrics.projection) failures.push(`${state.id}: timeline state surfaces incomplete`);
    } else if (state.kind === 'stats') {
      if (!metrics.methodology || metrics.kpis < 6 || metrics.sections < 5 || !metrics.methodologyLink) failures.push(`${state.id}: statistics hierarchy incomplete`);
    }

    const file = `${state.id}.png`;
    await page.screenshot({ path:path.join(outputRoot, file), fullPage:true, animations:'disabled' });
    records.push({ ...state, file, metrics });
    await context.close();
  }
} finally { await browser.close(); }

if (records.length !== states.length) failures.push(`expected ${states.length} captures, found ${records.length}`);
const manifest = {
  schema_version:'1.0',
  generated_at:new Date().toISOString(),
  implementation_pr:419,
  owner_approval:false,
  expected_capture_count:16,
  capture_count:records.length,
  failure_count:failures.length,
  horizontal_overflow_failure_count:failures.filter((item) => item.includes('horizontal overflow')).length,
  records,
  failures
};
fs.writeFileSync(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(manifest, null, 2)); process.exit(1); }
console.log(JSON.stringify({ ok:true, captures:records.length, owner_approval:false, output:'artifacts/pr419-guides-secondary-pages' }, null, 2));
