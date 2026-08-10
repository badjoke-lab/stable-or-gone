import fs from 'node:fs';

const replaceRequired = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`Missing expected ${label}`);
  return text.replace(before, after);
};

const scriptPath = 'src/scripts/stablecoin-index.ts';
let script = fs.readFileSync(scriptPath, 'utf8');
script = script.replace("  const compareDockActions = root.querySelector<HTMLElement>('.comparison-dock-actions');\n", '');
script = replaceRequired(script,
`    if (compareDock) {
      if (count === 0) {
        compareDock.classList.remove('stats-v4-jump', 'masthead-row');
        compareDock.hidden = true;
      } else {
        compareDock.hidden = false;
        compareDock.classList.add('stats-v4-jump', 'masthead-row');
      }
    }
    compareDockActions?.classList.toggle('masthead-actions', count > 0);
`,
`    if (compareDock) compareDock.hidden = count === 0;
`,
'dynamic sticky dock block');
fs.writeFileSync(scriptPath, script);

const validatorPath = 'scripts/validate-stablecoin-compare-discovery-navigation-remediation.mjs';
let validator = fs.readFileSync(validatorPath, 'utf8');
validator = replaceRequired(validator,
`for (const marker of ['renderComparisonNavigation', "classList.add('stats-v4-jump', 'masthead-row')", "classList.remove('stats-v4-jump', 'masthead-row')", 'selectedComparisons.size < 2', 'comparePanel.scrollIntoView', 'compareAddButton?.addEventListener', 'selectedComparisons.size >= 4', 'writeUrl'])`,
`for (const marker of ['renderComparisonNavigation', 'selectedComparisons.size < 2', 'comparePanel.scrollIntoView', 'compareAddButton?.addEventListener', 'selectedComparisons.size >= 4', 'writeUrl'])`,
'validator sticky markers');
validator = replaceRequired(validator,
`check(css.includes('/* Stablecoin comparison matrix remediation */'), 'existing comparison stylesheet contract missing');`,
`check(css.includes('/* Stablecoin comparison matrix remediation */'), 'existing comparison stylesheet contract missing');
check(css.includes('/* Stablecoin comparison discovery navigation remediation */'), 'Compare discovery stylesheet marker missing');
check(css.includes('.comparison-dock{position:fixed'), 'Compare dock must be fixed while selection exists');
check(css.includes('.comparison-dock[hidden]{display:none}'), 'Compare dock hidden-state CSS missing');`,
'validator css contract');
validator = validator.replace("stylesheet_mode: 'existing_single_public_ui_stylesheet'", "stylesheet_mode: 'existing_single_public_ui_stylesheet_with_bounded_fixed_dock'");
fs.writeFileSync(validatorPath, validator);

const auditPath = 'scripts/audit-stablecoin-compare-navigation.mjs';
let audit = fs.readFileSync(auditPath, 'utf8');
audit = replaceRequired(audit,
`      stickyClass: dock?.classList.contains('stats-v4-jump'),
      layoutClass: dock?.classList.contains('masthead-row'),
`,
`      position: dock instanceof HTMLElement ? getComputedStyle(dock).position : '',
`,
'audit one-selection classes');
audit = replaceRequired(audit,
`one.dockHidden === false && one.stickyClass && one.layoutClass && one.viewDisabled === true`,
`one.dockHidden === false && one.position === 'fixed' && one.viewDisabled === true`,
'audit one-selection assertion');
audit = replaceRequired(audit,
`return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), viewport: window.innerHeight };`,
`return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), viewport: window.innerHeight, position: getComputedStyle(dock).position };`,
'audit desktop geometry');
audit = replaceRequired(audit,
`!sticky.hidden && sticky.top >= 0 && sticky.top < 180 && sticky.bottom <= sticky.viewport`,
`!sticky.hidden && sticky.position === 'fixed' && sticky.top >= 0 && sticky.bottom <= sticky.viewport`,
'audit desktop persistence');
audit = replaceRequired(audit,
`return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), width: r.width, viewportWidth: window.innerWidth };`,
`return { top: r.top, bottom: r.bottom, hidden: dock.hasAttribute('hidden'), width: r.width, viewportWidth: window.innerWidth, position: getComputedStyle(dock).position };`,
'audit mobile geometry');
audit = replaceRequired(audit,
`!one.hidden && one.top >= 0 && one.top < 170 && one.bottom <= 844 && one.width <= one.viewportWidth`,
`!one.hidden && one.position === 'fixed' && one.top >= 0 && one.bottom <= 844 && one.width <= one.viewportWidth`,
'audit mobile persistence');
fs.writeFileSync(auditPath, audit);
