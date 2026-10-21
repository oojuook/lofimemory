import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const htmlFiles = await walk(publicDir);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    const original = await fs.readFile(filePath, 'utf8');
    const cleaned = original.replace(/[ \t]+\n/g, '\n');

    if (cleaned !== original) {
      await fs.writeFile(filePath, cleaned, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(`[remove-trailing-whitespace] Updated ${updatedCount} HTML file(s).`);
}

main().catch((error) => {
  console.error('[remove-trailing-whitespace] Failed to clean HTML files.', error);
  process.exitCode = 1;
});
