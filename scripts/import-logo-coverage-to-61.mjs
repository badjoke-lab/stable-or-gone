#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const logoDir = path.join(root, 'public/stablecoin-logos');
const bgdRoot = process.env.BGD_ICONS_DIR ?? '/tmp/bgd-web3-icons';
const metamaskRoot = process.env.METAMASK_METADATA_DIR ?? '/tmp/metamask-contract-metadata';
const bgdCommit = 'fd03ac0b5aaaeb9d0e6b85958e56eaaf9613db22';
const metamaskCommit = 'd693f70b9c14db177562957b00a70cfcd922b266';

const batch = [
  ['alusd', 'alusd.svg', bgdRoot, 'icons/full/alusd.svg'],
  ['usdtb', 'usdtb.svg', bgdRoot, 'icons/full/usdtb.svg'],
  ['mountain-usdm', 'mountain-usdm.svg', bgdRoot, 'icons/full/usdm.svg'],
  ['susde', 'susde.svg', bgdRoot, 'icons/full/susde.svg'],
  ['eura', 'eura.svg', bgdRoot, 'icons/full/eura.svg'],
  ['mento-eurm', 'mento-eurm.svg', bgdRoot, 'icons/full/eurm.svg'],
  ['monerium-eure', 'monerium-eure.svg', bgdRoot, 'icons/full/eure.svg'],
  ['rlusd', 'rlusd.svg', bgdRoot, 'icons/full/rlusd.svg'],
  ['usdg', 'usdg.svg', bgdRoot, 'icons/full/usdg.svg'],
  ['usds', 'usds.svg', bgdRoot, 'icons/full/usds.svg'],
  ['dollar-on-chain', 'dollar-on-chain.png', metamaskRoot, 'icons/eip155:30/erc20:0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db.png']
];

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label}: marker missing`);
  return source.replace(before, after);
};

fs.mkdirSync(logoDir, { recursive: true });
for (const [slug, filename, sourceRoot, sourcePath] of batch) {
  const input = path.join(sourceRoot, sourcePath);
  if (!fs.existsSync(input)) throw new Error(`missing pinned source for ${slug}: ${sourcePath}`);
  const bytes = fs.readFileSync(input);
  if (filename.endsWith('.svg')) {
    const source = bytes.toString('utf8').trim();
    if (!source.includes('<svg')) throw new Error(`invalid SVG for ${slug}`);
    fs.writeFileSync(path.join(logoDir, filename), `${source}\n`);
  } else {
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`invalid PNG for ${slug}`);
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== height || width < 32) throw new Error(`invalid logo geometry for ${slug}: ${width}x${height}`);
    fs.writeFileSync(path.join(logoDir, filename), bytes);
  }
}

const resolverPath = path.join(root, 'src/utils/stablecoinLogo.ts');
let resolver = fs.readFileSync(resolverPath, 'utf8');
const resolverEntries = batch.map(([slug, filename]) => `  '${slug}': '/stablecoin-logos/${filename}',`).join('\n');
resolver = replaceRequired(
  resolver,
  "const LOGOS_BY_SLUG: Readonly<Record<string, string>> = {\n  'agora-ausd': '/stablecoin-logos/agora-ausd.png',",
  `const LOGOS_BY_SLUG: Readonly<Record<string, string>> = {\n${resolverEntries}\n  'agora-ausd': '/stablecoin-logos/agora-ausd.png',`,
  'resolver mappings'
);
fs.writeFileSync(resolverPath, resolver);

const readmePath = path.join(logoDir, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace('Current audited coverage: **50 of 116 canonical Stable or Gone stablecoin records**.', 'Current audited coverage: **61 of 116 canonical Stable or Gone stablecoin records**.');
const sourceSections = `### BGD Labs MIT set\n\nSource: \`bgd-labs/web3-icons\`, distributed under the MIT License and pinned to commit:\n\n\`\`\`text\n${bgdCommit}\n\`\`\`\n\nLicense notice: \`LICENSE-bgd-web3-icons.txt\`. These ten records were manually identity-reviewed against the unique current SOG symbol/name pair; no ambiguous symbol was accepted.\n\n\`\`\`text\nalusd.svg             # Alchemix USD\nusdtb.svg             # Ethena USDtb\nmountain-usdm.svg     # Mountain Protocol USD\nsusde.svg             # Staked USDe\neura.svg              # Angle Euro\nmento-eurm.svg        # Mento Euro\nmonerium-eure.svg     # EURe\nrlusd.svg             # Ripple USD\nusdg.svg              # Global Dollar\nusds.svg              # USDS\n\`\`\`\n\n### MetaMask ISC address-verified set\n\nSource: \`MetaMask/contract-metadata\`, distributed under the ISC License and pinned to commit:\n\n\`\`\`text\n${metamaskCommit}\n\`\`\`\n\nLicense notice: \`LICENSE-metamask-contract-metadata.txt\`. The asset below was matched by the exact Rootstock contract address recorded in SOG.\n\n\`\`\`text\ndollar-on-chain.png\n\`\`\`\n\n`;
readme = replaceRequired(readme, '## Resolution rules\n', `${sourceSections}## Resolution rules\n`, 'README source sections');
fs.writeFileSync(readmePath, readme);

fs.writeFileSync(path.join(logoDir, 'LICENSE-bgd-web3-icons.txt'), `MIT License\n\nCopyright (c) 2024 BGD labs\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n`);

fs.writeFileSync(path.join(logoDir, 'LICENSE-metamask-contract-metadata.txt'), `ISC License\n\nCopyright (c) 2020 MetaMask\n\nPermission to use, copy, modify, and/or distribute this software for any\npurpose with or without fee is hereby granted, provided that the above\ncopyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES\nWITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF\nMERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR\nANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES\nWHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN\nACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF\nOR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.\n`);

const coveragePath = path.join(root, 'scripts/audit-stablecoin-logo-coverage.mjs');
let coverage = fs.readFileSync(coveragePath, 'utf8');
coverage = replaceRequired(
  coverage,
  "const trustWalletLicensePath = path.join(logoDir, 'LICENSE-trustwallet-assets.txt');",
  "const trustWalletLicensePath = path.join(logoDir, 'LICENSE-trustwallet-assets.txt');\nconst bgdLicensePath = path.join(logoDir, 'LICENSE-bgd-web3-icons.txt');\nconst metamaskLicensePath = path.join(logoDir, 'LICENSE-metamask-contract-metadata.txt');",
  'coverage license paths'
);
coverage = replaceRequired(
  coverage,
  "const expectedTrustWalletCommit = '34d808acb2a71e55c41505cd8f15c827db21b0fc';",
  "const expectedTrustWalletCommit = '34d808acb2a71e55c41505cd8f15c827db21b0fc';\nconst expectedBgdCommit = 'fd03ac0b5aaaeb9d0e6b85958e56eaaf9613db22';\nconst expectedMetamaskCommit = 'd693f70b9c14db177562957b00a70cfcd922b266';",
  'coverage source commits'
);
coverage = replaceRequired(
  coverage,
  "const trustWalletLicense = fs.readFileSync(trustWalletLicensePath, 'utf8');",
  "const trustWalletLicense = fs.readFileSync(trustWalletLicensePath, 'utf8');\nconst bgdLicense = fs.readFileSync(bgdLicensePath, 'utf8');\nconst metamaskLicense = fs.readFileSync(metamaskLicensePath, 'utf8');",
  'coverage licenses'
);
coverage = coverage.replaceAll('mappings.length !== 50', 'mappings.length !== 61')
  .replaceAll('expected 50 canonical logo mappings', 'expected 61 canonical logo mappings')
  .replaceAll("readme.includes('Current audited coverage: **50 of 116')", "readme.includes('Current audited coverage: **61 of 116')")
  .replaceAll('README coverage statement is not 50 of 116', 'README coverage statement is not 61 of 116');
coverage = replaceRequired(
  coverage,
  "if (!trustWalletLicense.startsWith('MIT License')) failures.push('Trust Wallet Assets MIT license notice is missing or malformed');",
  "if (!trustWalletLicense.startsWith('MIT License')) failures.push('Trust Wallet Assets MIT license notice is missing or malformed');\nif (!readme.includes(expectedBgdCommit)) failures.push('pinned BGD Labs commit is missing from README');\nif (!readme.includes(expectedMetamaskCommit)) failures.push('pinned MetaMask commit is missing from README');\nif (!bgdLicense.startsWith('MIT License')) failures.push('BGD Labs MIT license notice is missing or malformed');\nif (!metamaskLicense.startsWith('ISC License')) failures.push('MetaMask ISC license notice is missing or malformed');",
  'coverage source checks'
);
coverage = replaceRequired(
  coverage,
  "for (const requiredSlug of ['agora-ausd', 'basis-cash', 'busd', 'falcon-usdf', 'lisusd', 'mento-dollar', 'qidao-mai', 'sdai', 'usd0', 'usd1', 'ust', 'beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {",
  "for (const requiredSlug of ['alusd', 'usdtb', 'mountain-usdm', 'susde', 'eura', 'mento-eurm', 'monerium-eure', 'rlusd', 'usdg', 'usds', 'dollar-on-chain', 'agora-ausd', 'basis-cash', 'busd', 'falcon-usdf', 'lisusd', 'mento-dollar', 'qidao-mai', 'sdai', 'usd0', 'usd1', 'ust', 'beanstalk-bean', 'berachain-honey', 'crvusd', 'djed', 'eurs', 'musd', 'near-usn', 'united-stables-u']) {",
  'coverage required slugs'
);
coverage = replaceRequired(
  coverage,
  "  pinned_trustwallet_commit: expectedTrustWalletCommit,",
  "  pinned_trustwallet_commit: expectedTrustWalletCommit,\n  pinned_bgd_commit: expectedBgdCommit,\n  pinned_metamask_commit: expectedMetamaskCommit,",
  'coverage report commits'
);
fs.writeFileSync(coveragePath, coverage);

console.log(JSON.stringify({
  bgdCommit,
  metamaskCommit,
  imported: batch.map(([slug, filename]) => ({ slug, filename })),
  projectedCoverage: 61
}, null, 2));
