#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const filesToCopy = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'options.html',
  'options.js',
  'styles.css',
  'LICENSE-PRIVATE',
  'icons',
];

async function build() {
  console.log('🔨 Building extension...');

  // Clean dist directory
  try {
    await fs.rm(distDir, { recursive: true, force: true });
  } catch {
    // Directory might not exist, ignore error
  }
  await fs.mkdir(distDir, { recursive: true });

  // Copy files
  for (const file of filesToCopy) {
    const src = path.join(rootDir, file);
    const dest = path.join(distDir, file);

    const stats = await fs.stat(src);
    if (stats.isDirectory()) {
      await fs.cp(src, dest, { recursive: true });
      console.log(`  ✓ Copied directory: ${file}`);
    } else {
      await fs.copyFile(src, dest);
      console.log(`  ✓ Copied file: ${file}`);
    }
  }

  console.log('✅ Build complete! Output in dist/');
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
