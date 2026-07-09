import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadDeploymentVerification } from './load-deployment-verification.mjs';

const verificationPath = 'data/deployment-verification-pr229.json';
const original = fs.readFileSync(verificationPath, 'utf8');
const merged = loadDeploymentVerification(process.cwd());

try {
  fs.writeFileSync(verificationPath, `${JSON.stringify(merged, null, 2)}\n`);
  execFileSync(process.execPath, ['scripts/audit-registry-deployment-chain-identity.mjs', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env,
  });
} finally {
  fs.writeFileSync(verificationPath, original);
}
