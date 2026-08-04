import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { PUBLIC_ORIGIN } from './config/public-origin.mjs';

function listHtmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listHtmlFiles(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

function seoOutputHardening() {
  return {
    name: 'sog-seo-output-hardening',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const outputRoot = fileURLToPath(dir);
        const files = listHtmlFiles(outputRoot);
        let changed = 0;

        for (const file of files) {
          const before = fs.readFileSync(file, 'utf8');
          let after = before.replaceAll('/og/sog-og.svg', '/og/sog-og.png');

          if (!after.includes('property="og:image:width"')) {
            after = after.replace(
              /(<meta property="og:image" content="[^"]+"\s*\/?>)/,
              '$1<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Stable or Gone stablecoin history registry">'
            );
          }
          if (!after.includes('name="twitter:image:alt"')) {
            after = after.replace(
              /(<meta name="twitter:image" content="[^"]+"\s*\/?>)/,
              '$1<meta name="twitter:image:alt" content="Stable or Gone stablecoin history registry">'
            );
          }

          if (after !== before) {
            fs.writeFileSync(file, after);
            changed += 1;
          }
        }

        console.log(`SOG SEO output hardening: ${changed}/${files.length} HTML files updated.`);
      }
    }
  };
}

export default defineConfig({
  site: PUBLIC_ORIGIN,
  output: 'static',
  integrations: [seoOutputHardening()]
});
