import fs from 'node:fs';
import path from 'node:path';

const measurementId = String(process.env.PUBLIC_GA_MEASUREMENT_ID || '').trim();
const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error(JSON.stringify({ ok: false, reason: 'dist_missing' }));
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(distDir);

if (!measurementId) {
  console.log(JSON.stringify({
    ok: true,
    configured: false,
    result: 'ga4_measurement_id_not_configured',
    html_files_scanned: htmlFiles.length
  }, null, 2));
  process.exit(0);
}

const loaderNeedle = 'googletagmanager.com/gtag/js?id=';
const configNeedleSingle = `gtag('config','${measurementId}')`;
const configNeedleDouble = `gtag("config","${measurementId}")`;
let loaderFiles = 0;
let configFiles = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes(loaderNeedle) && html.includes(measurementId)) loaderFiles += 1;
  if (html.includes(configNeedleSingle) || html.includes(configNeedleDouble)) configFiles += 1;
}

const ok = htmlFiles.length > 0 && loaderFiles === htmlFiles.length && configFiles === htmlFiles.length;
const result = {
  ok,
  configured: true,
  html_files_scanned: htmlFiles.length,
  loader_files: loaderFiles,
  config_files: configFiles
};

if (!ok) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
