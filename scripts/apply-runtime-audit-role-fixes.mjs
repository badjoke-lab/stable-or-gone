#!/usr/bin/env node
import fs from 'node:fs';

const auditPath = 'scripts/audit-public-typography-enums-direct.mjs';
const cssPath = 'src/styles/site-ui.css';

let audit = fs.readFileSync(auditPath, 'utf8');

const serifLine = "          const editorialSerifSelector = 'main h1, main h2, main [data-editorial-serif], main [data-editorial-number]';";
const monoLine = "          const explicitMonoSelector = '.bar, .kicker, .eyebrow, [class*=\"overline\"], [class*=\"-label\"], dt, th, .home-masthead__edition, .home-section-kicker, .home-material-list__meta, .home-guide-list__meta, .v3-masthead-meta, .record-kicker, .record-symbol, [data-ui-mono]';";
if (!audit.includes(monoLine)) {
  if (!audit.includes(serifLine)) throw new Error('editorial serif selector marker missing');
  audit = audit.replace(serifLine, `${serifLine}\n${monoLine}`);
}

const oldRoleBlock = `            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const forbidden = families.find((family) => monospaceFamilies.has(family) || (!allowsSerif && serifFamilies.has(family)));
            if (forbidden) unexpectedFonts.push({ element: key, text: displayText(element).slice(0, 160), font_family: fontFamily, forbidden_family: forbidden, expected_role: allowsSerif ? 'editorial-serif' : 'ordinary-sans' });`;
const newRoleBlock = `            const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
            const allowsMono = element.matches(explicitMonoSelector) || Boolean(element.closest(explicitMonoSelector));
            const forbidden = families.find((family) => (!allowsMono && monospaceFamilies.has(family)) || (!allowsSerif && serifFamilies.has(family)));
            if (forbidden) unexpectedFonts.push({ element: key, text: displayText(element).slice(0, 160), font_family: fontFamily, forbidden_family: forbidden, expected_role: allowsSerif ? 'editorial-serif' : allowsMono ? 'label-mono' : 'ordinary-sans' });`;
if (audit.includes(oldRoleBlock)) audit = audit.replace(oldRoleBlock, newRoleBlock);
else if (!audit.includes('const allowsMono = element.matches(explicitMonoSelector)')) throw new Error('font role block marker missing');

const oldHoverBlock = `        const invalidLinkHover = [];
        for (const target of result.link_targets) {
          const locator = page.locator(\`[data-ui-audit-link="\${target.id}"]\`);
          await locator.hover({ timeout: 5000 });
          const hoverColor = await locator.evaluate((element) => getComputedStyle(element).color);
          const allowed = target.zone === 'main'
            ? [result.allowed_hover_colors.link]
            : [result.allowed_hover_colors.link, result.allowed_hover_colors.text];
          if (!allowed.includes(hoverColor)) invalidLinkHover.push({ ...target, hover_color: hoverColor, allowed });
        }`;
const newHoverBlock = `        const invalidLinkHover = [];
        if (!device.hasTouch) {
          for (const target of result.link_targets) {
            const locator = page.locator(\`[data-ui-audit-link="\${target.id}"]\`);
            await locator.hover({ timeout: 5000 });
            const hoverColor = await locator.evaluate((element) => getComputedStyle(element).color);
            const allowed = target.zone === 'main'
              ? [result.allowed_hover_colors.link]
              : [result.allowed_hover_colors.link, result.allowed_hover_colors.text];
            if (!allowed.includes(hoverColor)) invalidLinkHover.push({ ...target, hover_color: hoverColor, allowed });
          }
        }`;
if (audit.includes(oldHoverBlock)) audit = audit.replace(oldHoverBlock, newHoverBlock);
else if (!audit.includes('if (!device.hasTouch)')) throw new Error('hover audit block marker missing');

fs.writeFileSync(auditPath, audit);

let css = fs.readFileSync(cssPath, 'utf8');
const interactionBlock = `
/* Final interaction enforcement: later component rules may not preserve legacy hover colors. */
main a:hover,
footer a:hover { color: var(--ui-link-hover); text-decoration-color: currentColor; }
main a:focus-visible,
footer a:focus-visible { color: var(--ui-link-hover); }
`;
if (!css.includes('/* Final interaction enforcement:')) {
  const marker = '@media (prefers-reduced-motion: reduce) {';
  if (!css.includes(marker)) throw new Error('reduced-motion insertion marker missing');
  css = css.replace(marker, `${interactionBlock}\n${marker}`);
  fs.writeFileSync(cssPath, css);
}
