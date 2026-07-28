import fs from 'node:fs';

const file = 'src/pages/index.astro';
let source = fs.readFileSync(file, 'utf8');
const replace = (from, to, label) => {
  if (!source.includes(from)) throw new Error(`${label}: source block missing`);
  source = source.replace(from, to);
};

replace(
  "    const rows = Array.from(document.querySelectorAll('[data-row=\"stablecoin\"]'));\n\n    function compareRows(a, b, sort) {",
  "    const rows = Array.from(document.querySelectorAll<HTMLTableRowElement>('[data-row=\"stablecoin\"]'));\n    type RegistryControls = { q: string; lifecycle: string; sort: string };\n\n    function compareRows(a: HTMLTableRowElement, b: HTMLTableRowElement, sort: string) {",
  'type registry rows and comparator'
);
replace(
  '    function readControls() {',
  '    function readControls(): RegistryControls {',
  'type control reader'
);
replace(
  '    function writeUrlState(controls) {',
  '    function writeUrlState(controls: RegistryControls) {',
  'type URL-state writer'
);

fs.writeFileSync(file, source);
console.log(JSON.stringify({ ok: true, file }, null, 2));
