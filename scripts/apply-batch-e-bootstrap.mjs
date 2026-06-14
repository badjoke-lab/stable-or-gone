import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const parts = [
  'chunk-00.txt',
  'chunk-01.txt',
  'chunk-02a.txt',
  ...Array.from({ length: 22 }, (_, index) => `chunk-${String(index + 3).padStart(2, '0')}.txt`)
];

const source = parts
  .map((name) => fs.readFileSync(path.join('scripts', 'batch-e-source', name), 'utf8'))
  .join('');

const runtime = path.resolve('.batch-e-runtime.mjs');
fs.writeFileSync(runtime, source);

try {
  await import(pathToFileURL(runtime).href);
} finally {
  if (fs.existsSync(runtime)) fs.unlinkSync(runtime);
}
