import fs from 'node:fs';
const read=(p)=>fs.readFileSync(p,'utf8');
const failures=[];
const check=(v,m)=>{if(!v)failures.push(m)};
const pages={
  models:read('src/pages/models/index.astro'),glossary:read('src/pages/glossary/index.astro'),
  methodology:read('src/pages/methodology/index.astro'),about:read('src/pages/about/index.astro'),
  contact:read('src/pages/contact/index.astro'),support:read('src/pages/support/index.astro'),
  updates:read('src/pages/updates/index.astro'),maintenance:read('src/pages/maintenance/index.astro')
};
const styles=read('src/styles/ui-remediation-r7.css');
const updateScript=read('src/scripts/update-feed-ui.ts');
const r6Contents=read('src/components/LongformContentsR6.astro');

for(const marker of ['.r7-page','.r7-masthead','.r7-row-list','.r7-primary-action','.r7-disclosure','.r7-glossary-list','.r7-model-groups','.r7-update-pagination','.r7-maintenance-current','@media (max-width:760px)']) check(styles.includes(marker),`R7 CSS missing: ${marker}`);
check(!styles.includes('radial-gradient')&&!styles.includes('border-radius:24px'),'R7 SaaS decoration detected');
for(const name of ['models','glossary','about','contact','support']){
  check(pages[name].includes(`data-r7-page="${name}"`),`${name}: R7 marker missing`);
  check(pages[name].includes('ui-remediation-r7.css'),`${name}: R7 CSS import missing`);
  check(!pages[name].includes('EditorialPageHeader'),`${name}: old masthead remains`);
  check(!pages[name].includes('mini-card'),`${name}: mini cards remain`);
}
for(const marker of ['>Purpose<','>Coverage and exclusions<','>Review process<','>Operator and independence<','badjoke-lab']) check(pages.about.includes(marker),`About missing: ${marker}`);
for(const marker of ['data-ui-v3-utility="contact-corrections"','Open correction form','Secondary routes','No private secrets','googleFormUrl','githubIssueUrl']) check(pages.contact.includes(marker),`Contact missing: ${marker}`);
check((pages.contact.match(/class="r7-primary-action"/g)||[]).length===1,'Contact primary action count changed');
for(const marker of ['data-ui-v3-utility="support"','data-donation-action','Choose a donation asset','What support funds','Editorial independence','wallets.length','data-copy-address','navigator.clipboard','fallbackCopy']) check(pages.support.includes(marker),`Support missing: ${marker}`);
check((pages.support.match(/data-donation-action/g)||[]).length===1,'Support donation action count changed');
for(const marker of ['data-r7-glossary-search','data-r7-glossary-term','data-r7-glossary-count','data-r7-glossary-empty','r7-letter-nav']) check(pages.glossary.includes(marker),`Glossary missing: ${marker}`);
check(!pages.glossary.includes('reference-mobile-records')&&!pages.glossary.includes('reference-table'),'Glossary duplicate surfaces remain');
for(const marker of ['Issuance structures','Backing structures','Stabilization mechanisms','r7-model-row','Unknown state']) check(pages.models.includes(marker),`Models missing: ${marker}`);
for(const marker of ['data-r7-page="updates"','data-update-feed-pagination','data-update-feed-page-prev','data-update-feed-page-next','Publication dates and historical dates are different']) check(pages.updates.includes(marker),`Updates missing: ${marker}`);
for(const marker of ['page_size','currentPage',"params.get('page')",'data-update-feed-page-prev','data-update-feed-page-next']) check(updateScript.includes(marker),`Update script missing: ${marker}`);
for(const marker of ['data-r7-page="maintenance"','r7-maintenance-current','Current public state','Next focus','Previous monthly checkpoints','What the public maintenance log includes and excludes']) check(pages.maintenance.includes(marker),`Maintenance missing: ${marker}`);
check(pages.maintenance.indexOf('r7-maintenance-current')<pages.maintenance.indexOf('maintenance-ledger'),'Maintenance current state appears after diagnostics');
for(const marker of ['data-methodology-version="r6"','<LongformContentsR6','>Operational summary<','data-r6-reference','ValueStateMethodology']) check(pages.methodology.includes(marker),`R6 Methodology missing: ${marker}`);
check(r6Contents.includes('data-r6-contents'),'R6 contents navigation missing');

const result={schema_version:'1.3',ok:failures.length===0,gate:'V3-G-R7',reference_pages:2,update_feed_pages:1,maintenance_pages:1,about_pages:1,utility_pages:2,canonical_record_changes:0,route_changes:0,failures};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exit(1);
