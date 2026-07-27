#!/usr/bin/env node
import fs from 'node:fs';

const readabilityPath = 'scripts/audit-ui-readability.mjs';
const colorPath = 'scripts/audit-ui-color-system.mjs';

let readability = fs.readFileSync(readabilityPath, 'utf8');
readability = readability.replace("const accent = rootStyle.getPropertyValue('--v3-accent').trim();", "const accent = rootStyle.getPropertyValue('--ui-danger').trim();");

if (!readability.includes('const editorialSerifSelector = [')) throw new Error('readability editorial selector missing');
if (!readability.includes('const explicitMonoSelector = [')) throw new Error('readability mono selector missing');

const oldFontBlock = `        const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
        const forbidden = families.find((family) => monospaceFamilies.has(family) || (!allowsSerif && serifFamilies.has(family)));
        if (forbidden) push('unexpected_public_font', {
          ...sample(element, 'public-font'),
          forbidden_family: forbidden,
          expected_role: allowsSerif ? 'editorial-serif' : 'ordinary-sans'
        });`;
const newFontBlock = `        const allowsSerif = element.matches(editorialSerifSelector) || Boolean(element.closest(editorialSerifSelector));
        const allowsMono = element.matches(explicitMonoSelector) || Boolean(element.closest(explicitMonoSelector));
        const forbidden = families.find((family) => (!allowsMono && monospaceFamilies.has(family)) || (!allowsSerif && serifFamilies.has(family)));
        if (forbidden) push('unexpected_public_font', {
          ...sample(element, 'public-font'),
          forbidden_family: forbidden,
          expected_role: allowsSerif ? 'editorial-serif' : allowsMono ? 'label-mono' : 'ordinary-sans'
        });`;
if (readability.includes(oldFontBlock)) readability = readability.replace(oldFontBlock, newFontBlock);
else if (!readability.includes('const allowsMono = element.matches(explicitMonoSelector)')) throw new Error('readability font role block missing');
fs.writeFileSync(readabilityPath, readability);

let color = fs.readFileSync(colorPath, 'utf8');
const oldTokens = `      const tokens = Object.fromEntries([
        '--v3-text', '--v3-text-muted', '--v3-text-quiet', '--v3-accent', '--v3-archive',
        '--v3-positive', '--v3-warning', '--v3-danger', '--v3-violet',
        '--bg', '--muted', '--gold', '--sog-link', '--sog-warning', '--shell-link', '--shell-warning'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));`;
const newTokens = `      const tokens = Object.fromEntries([
        '--ui-bg', '--ui-bg-soft', '--ui-surface', '--ui-surface-strong',
        '--ui-text', '--ui-copy', '--ui-muted', '--ui-quiet',
        '--ui-line', '--ui-line-soft', '--ui-link', '--ui-hover', '--ui-visited', '--ui-focus',
        '--ui-positive', '--ui-warning', '--ui-danger', '--ui-neutral'
      ].map((name) => [name, rootStyle.getPropertyValue(name).trim()]));`;
if (color.includes(oldTokens)) color = color.replace(oldTokens, newTokens);
else if (!color.includes("'--ui-hover'")) throw new Error('color audit token inventory marker missing');
fs.writeFileSync(colorPath, color);

console.log(JSON.stringify({ readabilityPath, colorPath }, null, 2));
