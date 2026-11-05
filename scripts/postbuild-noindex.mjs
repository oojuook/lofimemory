import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { approvalFocusedArticles, alwaysKeptFiles, coreIndexedPages } from './approval-pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const rootHtmlFiles = new Set(['index.html', 'app.html']);
const indexedPages = new Set([...coreIndexedPages, ...approvalFocusedArticles]);
const alwaysKept = new Set(alwaysKeptFiles);
const adsenseScriptPattern = /\s*<script[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>\s*/gi;

function shouldKeepFile(fileName) {
  return indexedPages.has(fileName) || alwaysKept.has(fileName);
}

function shouldIndex(fileName) {
  return indexedPages.has(fileName);
}

function upsertRobotsMeta(html, shouldAllowIndex) {
  const desired = shouldAllowIndex ? 'index, follow' : 'noindex, follow';
  if (/<meta\s+name=["']robots["']/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?\s*>/i, `<meta name="robots" content="${desired}" />`);
  }
  return html.replace(/<\/head>/i, `  <meta name="robots" content="${desired}" />\n</head>`);
}

async function main() {
  const entries = await fs.readdir(distDir, { withFileTypes: true });
  const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name);

  await Promise.all(
    htmlFiles.map(async (fileName) => {
      if (!shouldKeepFile(fileName)) {
        await fs.unlink(path.join(distDir, fileName));
        return;
      }

      const filePath = path.join(distDir, fileName);
      let html = await fs.readFile(filePath, 'utf8');
      html = html.replace(adsenseScriptPattern, '\n');
      html = upsertRobotsMeta(html, shouldIndex(fileName));
      await fs.writeFile(filePath, html, 'utf8');
    })
  );

  const remainingEntries = await fs.readdir(distDir, { withFileTypes: true });
  const remainingHtml = remainingEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name);
  const missingExpected = [...indexedPages].filter((fileName) => !rootHtmlFiles.has(fileName) && !remainingHtml.includes(fileName));

  if (missingExpected.length > 0) {
    console.warn('[postbuild-noindex] Some expected approval-focused pages were missing from dist:', missingExpected.join(', '));
  }

  console.log(`[postbuild-noindex] Kept ${remainingHtml.length} HTML files in dist and stripped AdSense tags while review is pending.`);
}

main().catch((error) => {
  console.error('[postbuild-noindex] Failed to clean build output', error);
  process.exitCode = 1;
});
