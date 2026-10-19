import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const coreIndexedPages = new Set([
  'index.html',
  'blog.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'cookie-policy.html',
  'disclaimer.html',
  'editorial-policy.html',
  'advertising-policy.html',
  'content-quality-policy.html',
  'sitemap.html'
]);

const alwaysIgnored = new Set([
  'google5226abd8d86c0ece.html',
  'googled1931b3f15730e0b.html'
]);

const noindexMeta = '<meta name="robots" content="noindex, follow" />';
const adsenseScriptPattern = /\s*<script\s+async\s+src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"']+["'][^>]*><\/script>\s*/gi;

function shouldIndex(fileName) {
  if (alwaysIgnored.has(fileName)) return true;
  return coreIndexedPages.has(fileName) || fileName.startsWith('article-');
}

function stripAdSenseFromLowValuePages(html, fileName) {
  if (shouldIndex(fileName)) return html;
  return html.replace(adsenseScriptPattern, '\n');
}

function upsertRobotsMeta(html, fileName) {
  const hasNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  const hasRobotsMeta = /<meta\s+name=["']robots["']/i.test(html);

  if (shouldIndex(fileName)) {
    if (!hasNoindex) return html;
    return html.replace(/\s*<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']\s*\/?>(\r?\n)?/i, '\n');
  }

  if (hasNoindex) return html;
  if (hasRobotsMeta) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, noindexMeta);
  }

  if (html.includes('</head>')) {
    return html.replace('</head>', `    ${noindexMeta}\n  </head>`);
  }

  return html;
}

async function main() {
  const entries = await fs.readdir(distDir, { withFileTypes: true });
  const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html'));

  let updatedCount = 0;
  for (const entry of htmlFiles) {
    const filePath = path.join(distDir, entry.name);
    const original = await fs.readFile(filePath, 'utf8');
    const updated = stripAdSenseFromLowValuePages(upsertRobotsMeta(original, entry.name), entry.name);
    if (updated !== original) {
      await fs.writeFile(filePath, updated, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(`[postbuild-noindex] Processed ${htmlFiles.length} html files, updated ${updatedCount}.`);
}

main().catch((error) => {
  console.error('[postbuild-noindex] Failed to update robots meta tags.', error);
  process.exitCode = 1;
});
