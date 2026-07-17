import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const layout = read('src/layouts/BaseLayout.astro');
const styles = read('src/styles/reference-utility-v3.css');
const header = read('src/components/EditorialPageHeader.astro');
const pages = {
  models: read('src/pages/models/index.astro'),
  glossary: read('src/pages/glossary/index.astro'),
  methodology: read('src/pages/methodology/index.astro'),
  about: read('src/pages/about/index.astro'),
  contact: read('src/pages/contact/index.astro'),
  support: read('src/pages/support/index.astro')
};
const updates = read('src/pages/updates/index.astro');
const updateFeedStyles = read('src/styles/update-feed.css');

for (const marker of [
  'reference-utility-v3.css',
  "const isReferencePage = ['/models/', '/glossary/', '/updates/', '/maintenance/']",
  "const isLongformPage = ['/methodology/', '/about/']",
  "const isUtilityPage = ['/contact/', '/support/']",
  'data-longform-article',
  'data-longform-toc',
  'data-longform-toc-list',
  'buildContents'
]) check(layout.includes(marker), `BaseLayout missing page-family contract: ${marker}`);
for (const marker of ['data-editorial-page-header', 'editorial-page-masthead', 'editorial-page-overline', 'editorial-page-title', 'editorial-page-ledger']) check(header.includes(marker), `EditorialPageHeader missing: ${marker}`);
for (const marker of ['.reference-entry-grid', '.reference-table', '.longform-layout', '.longform-toc', '.utility-action-grid', '.wallet-grid', '@media(max-width:820px)', '@media(forced-colors:active)']) check(styles.includes(marker), `Reference/utility CSS missing: ${marker}`);
check(!styles.includes('radial-gradient') && !styles.includes('border-radius:24px') && !styles.includes('box-shadow:0 16px'), 'Reference/utility CSS contains prohibited SaaS decoration');

for (const [name, page] of Object.entries(pages)) {
  check(page.includes('EditorialPageHeader'), `${name}: shared masthead missing`);
  check(!page.includes('<section class="hero'), `${name}: legacy hero remains`);
  check(!page.includes('class="panel stats"'), `${name}: KPI stats panel remains`);
}
for (const name of ['models', 'glossary']) check(pages[name].includes('data-ui-v3-reference'), `${name}: reference marker missing`);
check(pages.models.includes('reference-entry-grid') && pages.models.includes('models.length'), 'Models reference index is incomplete');
check(pages.glossary.includes('reference-table') && pages.glossary.includes('reference-mobile-records'), 'Glossary desktop/mobile reference surfaces missing');

for (const marker of [
  'data-update-feed-page',
  'getPublicUpdateFeed',
  'updatePublicCopy',
  'Two timelines, two different questions',
  'data-update-feed-filter-id="category"',
  'data-update-feed-filter-id="year"',
  'data-update-feed-filter-id="route_family"',
  'data-update-feed-results'
]) check(updates.includes(marker), `Updates feed surface missing: ${marker}`);
for (const marker of ['.update-feed-masthead', '.update-feed-boundary-grid', '.update-feed-filter-grid', '.update-feed-item', '@media (max-width: 719px)']) check(updateFeedStyles.includes(marker), `Update Feed CSS missing: ${marker}`);
check(!updateFeedStyles.includes('border-radius: 24px') && !updateFeedStyles.includes('box-shadow: 0 16px'), 'Update Feed CSS contains prohibited SaaS decoration');

check(pages.methodology.includes('ValueStateMethodology') && pages.methodology.includes('Core approach') && pages.methodology.includes('Incomplete or conflicting information'), 'Methodology protected sections missing');
check(pages.about.includes('What Stable or Gone covers') && pages.about.includes('What Stable or Gone is not') && pages.about.includes('support-callout'), 'About protected sections missing');
check(pages.contact.includes('data-ui-v3-utility="contact-corrections"') && pages.contact.includes('googleFormUrl') && pages.contact.includes('githubIssueUrl') && pages.contact.includes('No private secrets'), 'Contact/corrections functions missing');
check(pages.support.includes('data-ui-v3-utility="support"') && pages.support.includes('wallets.length') && pages.support.includes('data-copy-address') && pages.support.includes('navigator.clipboard') && pages.support.includes('fallbackCopy'), 'Support wallet or copy contract missing');

const result = {
  schema_version: '1.1',
  ok: failures.length === 0,
  shell: 'evidence-registry-pr411',
  reference_pages: 2,
  update_feed_pages: 1,
  maintenance_reference_routes: 1,
  longform_pages: 2,
  utility_pages: 2,
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
