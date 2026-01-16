#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

async function release() {
  console.log('🚀 Preparing release...');

  // Read manifest
  const manifestPath = path.join(rootDir, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  const version = manifest.version;

  console.log(`📌 Version: ${version}`);
  console.log('');
  console.log('To release to Chrome Web Store:');
  console.log('1. Build and package: npm run build && npm run package');
  console.log(`2. Upload build/github-swapper-v${version}.zip to:`);
  console.log('   https://chrome.google.com/webstore/devconsole');
  console.log('3. Fill in store listing details');
  console.log('4. Submit for review');
  console.log('');
  console.log('For automated releases, configure:');
  console.log('- CHROME_EXTENSION_ID (from first manual publish)');
  console.log('- CHROME_CLIENT_ID (OAuth2 client)');
  console.log('- CHROME_CLIENT_SECRET (OAuth2 secret)');
  console.log('- CHROME_REFRESH_TOKEN (OAuth2 refresh token)');
}

release().catch((err) => {
  console.error('❌ Release preparation failed:', err);
  process.exit(1);
});
