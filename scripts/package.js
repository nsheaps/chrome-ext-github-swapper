#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const buildDir = path.join(rootDir, 'build');

async function packageExtension() {
  console.log('📦 Packaging extension for Chrome Web Store...');

  // Ensure dist exists
  try {
    await fs.access(distDir);
  } catch {
    console.error('❌ dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Create build directory
  await fs.mkdir(buildDir, { recursive: true });

  // Read manifest to get version
  const manifestPath = path.join(distDir, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  const version = manifest.version;

  const zipPath = path.join(buildDir, `github-swapper-v${version}.zip`);

  // Create zip
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`✅ Package created: ${zipPath}`);
      console.log(`   Size: ${(archive.pointer() / 1024).toFixed(2)} KB`);
      resolve();
    });

    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(distDir, false);
    archive.finalize();
  });
}

packageExtension().catch((err) => {
  console.error('❌ Packaging failed:', err);
  process.exit(1);
});
