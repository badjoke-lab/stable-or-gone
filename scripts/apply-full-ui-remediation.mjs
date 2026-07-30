#!/usr/bin/env node
import fs from 'node:fs';

const replaceOnce = (source, before, after, label) => {
  if (!source.includes(before)) throw new Error(`Missing expected fragment: ${label}`);
  return source.replace(before, after);
};

const write = (path, content) => fs.writeFileSync(path, content);

// Home: keep the recent-record preview useful without burying the rest of the page.
{
  const path = 'src/pages/index.astro';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(source, '.slice(0, 20)', '.slice(0, 8)', 'home preview limit');
  write(path, source);
}

// Base layout: readable mobile TOCs, balanced header, and collapsible mobile footer groups.
{
  const path = 'src/layouts/BaseLayout.astro';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    '<a class="support-cta" href="/support/" aria-current={isCurrent(\'/support/\') ? \'page\' : undefined}>Support this archive</a>',
    '<a class="support-cta support-cta--header" href="/support/" aria-current={isCurrent(\'/support/\') ? \'page\' : undefined} aria-label="Support this archive"><span class="support-cta-label--full">Support this archive</span><span class="support-cta-label--compact" aria-hidden="true">Support</span></a>',
    'header support label'
  );
  source = replaceOnce(
    source,
    `        <div class="footer-navigation site-shell">\n          {footerNavigationGroups.map((group) => (\n            <nav class="footer-navigation-group" aria-label={\`${'${group.label}'} footer navigation\`}>\n              <strong>{group.label}</strong>\n              {group.items.map((item) => <a href={item.href}>{item.label}</a>)}\n            </nav>\n          ))}\n          <nav class="footer-navigation-group footer-data-links" aria-label="Public data links">\n            <strong>Public data</strong>\n            {dataLinks.map((item) => <a href={item.href}>{item.label}</a>)}\n          </nav>\n        </div>`,
    `        <div class="footer-navigation site-shell">\n          {footerNavigationGroups.map((group) => (\n            <details class="footer-navigation-group" data-footer-group data-disclosure open>\n              <summary>{group.label}</summary>\n              <nav aria-label={\`${'${group.label}'} footer navigation\`}>\n                {group.items.map((item) => <a href={item.href}>{item.label}</a>)}\n              </nav>\n            </details>\n          ))}\n          <details class="footer-navigation-group footer-data-links" data-footer-group data-disclosure open>\n            <summary>Public data</summary>\n            <nav aria-label="Public data links">\n              {dataLinks.map((item) => <a href={item.href}>{item.label}</a>)}\n            </nav>\n          </details>\n        </div>`,
    'footer disclosure groups'
  );
  source = replaceOnce(
    source,
    `      document.querySelectorAll('[data-disclosure]').forEach((item) => {\n        if (item instanceof HTMLDetailsElement) initialiseDisclosure(item);\n      });`,
    `      document.querySelectorAll('[data-disclosure]').forEach((item) => {\n        if (item instanceof HTMLDetailsElement) initialiseDisclosure(item);\n      });\n      if (window.matchMedia('(max-width: 640px)').matches) {\n        document.querySelectorAll('[data-footer-group]').forEach((item) => {\n          if (item instanceof HTMLDetailsElement) item.open = false;\n        });\n      }`,
    'mobile footer collapse'
  );
  source = replaceOnce(
    source,
    `        if (list.children.length === 0) toc.hidden = true;\n        if (window.matchMedia('(max-width: 820px)').matches) toc.open = false;`,
    `        if (list.children.length === 0) toc.hidden = true;\n        else if (window.matchMedia('(max-width: 820px)').matches) toc.open = true;`,
    'mobile table of contents visibility'
  );
  write(path, source);
}

// Statistics: progressively collapse lower analysis groups on every viewport.
{
  const path = 'src/pages/stats/index.astro';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    `  </article>\n</BaseLayout>`,
    `  </article>\n  <script>\n    const sections = [...document.querySelectorAll('.stats-page > .stats-section')];\n    sections.forEach((section, index) => {\n      if (!(section instanceof HTMLElement) || index < 2) return;\n      const heading = section.querySelector('h2');\n      const kicker = section.querySelector('.stats-kicker');\n      const details = document.createElement('details');\n      details.className = 'stats-disclosure';\n      const summary = document.createElement('summary');\n      const label = document.createElement('span');\n      const title = document.createElement('strong');\n      label.textContent = kicker?.textContent?.trim() || 'Statistics';\n      title.textContent = heading?.textContent?.trim() || 'Analysis section';\n      summary.append(label, title);\n      section.replaceWith(details);\n      details.append(summary, section);\n    });\n  </script>\n</BaseLayout>`,
    'statistics disclosures'
  );
  write(path, source);
}

// Single stylesheet: fix mobile heading overlap, TOCs, pagination cards, stats disclosures, and footer density.
{
  const path = 'src/styles/public-ui.css';
  let css = fs.readFileSync(path, 'utf8');
  css = replaceOnce(css, '.site-brand img { max-width: 126px; height: 32px; }', '.site-brand img { max-width: 144px; height: 34px; }', 'mobile brand size');
  css = replaceOnce(css, '.support-cta { min-height: 44px; padding-inline: 11px; font-size: 15px; }', '.support-cta { min-height: 44px; padding-inline: 11px; font-size: 15px; } .support-cta-label--compact { display: none; }', 'compact support label base');
  css = replaceOnce(
    css,
    `  .footer-navigation { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px 18px; padding-block: 10px; }\n  .footer-navigation-group { display: grid; align-content: start; gap: 1px; }\n  .footer-navigation-group a { width: fit-content; min-height: 40px; font-size: 15px; }`,
    `  .support-cta--header .support-cta-label--full { display: none; } .support-cta--header .support-cta-label--compact { display: inline; }\n  .footer-navigation { display: grid; grid-template-columns: 1fr; gap: 0; padding-block: 8px; }\n  .footer-navigation-group { display: block; border-bottom: 1px solid var(--ui-line); } .footer-navigation-group > summary { min-height: 44px; display: flex; align-items: center; justify-content: space-between; font: 700 13px/1.4 var(--ui-mono); letter-spacing: .05em; text-transform: uppercase; cursor: pointer; } .footer-navigation-group > summary::after { content: "+"; } .footer-navigation-group[open] > summary::after { content: "−"; } .footer-navigation-group nav { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); padding-bottom: 8px; } .footer-navigation-group a { width: fit-content; min-height: 36px; font-size: 15px; }`,
    'mobile footer density'
  );
  css = replaceOnce(
    css,
    `  :where(.stablecoin-index-section-heading,.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading,.timeline-section-heading,.compare-section-heading,.ar-section-heading,.maintenance-section-heading,.update-feed-section-heading,.stats-section-heading,.timeline-results-heading,.ar-results-heading,.update-feed-results-heading) { grid-template-columns: 1fr; gap: 8px; }\n  :where(.stablecoin-index-section-heading,.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading,.timeline-section-heading,.compare-section-heading,.ar-section-heading,.maintenance-section-heading,.update-feed-section-heading,.stats-section-heading,.timeline-results-heading,.ar-results-heading,.update-feed-results-heading) > * { grid-column: 1; grid-row: auto; width: 100%; max-width: 100%; }`,
    `  :where(.stablecoin-index-section-heading,.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading,.timeline-section-heading,.compare-section-heading,.ar-section-heading,.maintenance-section-heading,.update-feed-section-heading,.stats-section-heading,.timeline-results-heading,.ar-results-heading,.update-feed-results-heading) { grid-template-columns: 1fr; gap: 6px; }\n  :where(.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading) > p:first-child, :where(.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading) > h2, :where(.event-index-section-heading,.organization-index-section-heading,.event-detail-section-heading,.organization-detail-section-heading,.stablecoin-section-heading) > span, :where(.stablecoin-index-section-heading,.timeline-section-heading,.compare-section-heading,.ar-section-heading,.maintenance-section-heading,.update-feed-section-heading,.stats-section-heading,.timeline-results-heading,.ar-results-heading,.update-feed-results-heading) > * { grid-column: 1; grid-row: auto; align-self: auto; position: static; width: 100%; max-width: 100%; }`,
    'mobile section heading layout'
  );
  const insertion = `.static-registry-list{list-style:none;margin:0;padding:0;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}.static-registry-list>.static-registry-card{display:grid;grid-template-columns:42px minmax(0,1fr);gap:12px}.static-registry-item-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.static-registry-item-header h2{margin:2px 0 0;font:600 1.25rem/1.18 var(--ui-serif)}.static-registry-meta,.static-registry-item-description{margin:4px 0 0}\n.stats-disclosure{margin:0;border-bottom:1px solid var(--ui-text)}.stats-disclosure>summary{min-height:58px;display:grid;grid-template-columns:180px minmax(0,1fr);gap:16px;align-items:center;border-top:1px solid var(--ui-text);cursor:pointer}.stats-disclosure>summary span{color:var(--ui-muted);font:700 13px/1.4 var(--ui-mono);letter-spacing:.04em;text-transform:uppercase}.stats-disclosure>summary strong{font:600 1.35rem/1.2 var(--ui-serif)}.stats-disclosure[open]>summary{border-bottom:1px solid var(--ui-line)}\n.guide-article-toc[hidden],.longform-toc[hidden]{display:none!important}.guide-article-toc ol,.longform-toc ol{max-height:min(46vh,28rem);overflow:auto}.support-cta-label--compact{display:none}\n`;
  css = replaceOnce(css, '@media (max-width: 1120px) {', `${insertion}@media (max-width: 1120px) {`, 'shared remediation rules');
  css = replaceOnce(css, '  .report-actions { display: grid; grid-template-columns: 1fr; }', '  .static-registry-list { grid-template-columns: 1fr; } .static-registry-list > .static-registry-card { grid-template-columns: 32px minmax(0,1fr); padding: 11px 0; } .stats-disclosure > summary { grid-template-columns: 1fr; gap: 2px; padding: 8px 0; } .guide-article-toc ol, .longform-toc ol { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 2px 12px; }\n  .report-actions { display: grid; grid-template-columns: 1fr; }', 'mobile cards and disclosures');
  write(path, css);
}

// Readability audit: detect descendant heading collisions, empty visible TOCs, duplicate list markers, and route-specific page bloat.
{
  const path = 'scripts/audit-ui-readability.mjs';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(source, `        unexpected_public_font: [],\n        raw_public_enum: []`, `        unexpected_public_font: [],\n        raw_public_enum: [],\n        empty_visible_toc: [],\n        duplicate_visible_record_number: [],\n        excessive_route_height: []`, 'new screenshot findings');
  source = replaceOnce(
    source,
    `      const allowedInternalLinkColors = new Set([`,
    `      for (const container of [...document.querySelectorAll(sectionHeadingSelector)].filter(visible)) {\n        const descendants = [...container.querySelectorAll('p,h2,h3,span')].filter(visible);\n        for (let leftIndex = 0; leftIndex < descendants.length; leftIndex += 1) {\n          for (let rightIndex = leftIndex + 1; rightIndex < descendants.length; rightIndex += 1) {\n            const left = descendants[leftIndex];\n            const right = descendants[rightIndex];\n            if (left.contains(right) || right.contains(left)) continue;\n            const intersection = overlap(left.getBoundingClientRect(), right.getBoundingClientRect());\n            if (intersection.width <= 2 || intersection.height <= 2 || intersection.area <= 16) continue;\n            push('overlapping_section_heading_content', { container: pathFor(container), first: sample(left, 'section-heading-descendant'), second: sample(right, 'section-heading-descendant'), overlap_area_px: Math.round(intersection.area) });\n          }\n        }\n      }\n      for (const toc of [...document.querySelectorAll('.guide-article-toc,.longform-toc')].filter(visible)) {\n        const list = toc.querySelector('ol');\n        if (!(list instanceof HTMLOListElement) || list.children.length === 0) push('empty_visible_toc', sample(toc, 'table-of-contents'));\n      }\n      for (const item of [...document.querySelectorAll('.static-registry-list > li')].filter(visible)) {\n        if (!item.querySelector('.static-registry-number')) continue;\n        const marker = getComputedStyle(item, '::marker');\n        if (marker.content && !['none', 'normal', '\"\"'].includes(marker.content)) push('duplicate_visible_record_number', { ...sample(item, 'static-registry-item'), marker_content: marker.content });\n      }\n      const routeHeight = document.documentElement.scrollHeight;\n      if ((mobile && location.pathname === '/' && routeHeight > 5000) || (!mobile && location.pathname === '/stats/' && routeHeight > 9000)) push('excessive_route_height', { route: location.pathname, height_px: routeHeight });\n\n      const allowedInternalLinkColors = new Set([`,
    'new rendered checks'
  );
  source = replaceOnce(source, `    'unexpected_public_font', 'raw_public_enum'`, `    'unexpected_public_font', 'raw_public_enum', 'empty_visible_toc',\n    'duplicate_visible_record_number', 'excessive_route_height'`, 'audit totals categories');
  write(path, source);
}

{
  const path = 'scripts/validate-ui-readability.mjs';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(source, `    'unexpected_public_font',\n  'raw_public_enum'`, `    'unexpected_public_font',\n  'raw_public_enum',\n  'empty_visible_toc',\n  'duplicate_visible_record_number',\n  'excessive_route_height'`, 'validator categories');
  source = replaceOnce(source, `    section_heading_layout: 'direct heading children must not overlap',`, `    section_heading_layout: 'visible heading text must not overlap at any descendant level',\n    navigation_integrity: 'visible tables of contents must contain links and static lists must not show duplicate numbering',\n    route_height: 'home mobile <=5000px and statistics desktop <=9000px in representative captures',`, 'validator policy');
  write(path, source);
}

fs.rmSync('scripts/apply-full-ui-remediation.mjs', { force: true });
fs.rmSync('.github/workflows/apply-full-ui-remediation.yml', { force: true });
console.log('Applied full representative UI remediation and removed temporary transformer.');
