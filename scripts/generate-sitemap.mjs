import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { approvalFocusedArticles, alwaysKeptFiles, coreIndexedPages } from './approval-pages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = 'https://lofimemory.vercel.app';

const rootHtmlPages = new Set(['index.html', 'app.html']);
const highPriorityPages = new Set(['index.html', 'app.html', 'blog.html']);
const trustPages = new Set([
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
const articlePages = new Set(approvalFocusedArticles);
const ignoredPages = new Set(alwaysKeptFiles);

function toAbsoluteUrl(fileName) {
  if (fileName === 'index.html') return `${baseUrl}/`;
  return `${baseUrl}/${fileName}`;
}

async function getLastMod(fileName) {
  const filePath = path.join(publicDir, fileName);
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function getPriority(fileName) {
  if (fileName === 'index.html') return '1.0';
  if (highPriorityPages.has(fileName)) return '0.94';
  if (trustPages.has(fileName)) return '0.82';
  if (articlePages.has(fileName)) return '0.78';
  return '0.72';
}

function getChangeFreq(fileName) {
  if (highPriorityPages.has(fileName)) return 'weekly';
  if (articlePages.has(fileName)) return 'monthly';
  return 'yearly';
}

async function main() {
  const entries = await fs.readdir(publicDir, { withFileTypes: true });
  const publicHtmlFiles = new Set(entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name));

  const pages = [...new Set([...coreIndexedPages, ...approvalFocusedArticles])].filter((fileName) => {
    if (ignoredPages.has(fileName)) return false;
    return rootHtmlPages.has(fileName) || publicHtmlFiles.has(fileName);
  });

  const pageEntries = await Promise.all(
    pages.map(async (fileName) => ({
      fileName,
      loc: toAbsoluteUrl(fileName),
      lastmod: await getLastMod(fileName),
      changefreq: getChangeFreq(fileName),
      priority: getPriority(fileName)
    }))
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  await fs.writeFile(sitemapPath, xml, 'utf8');
  console.log(`[generate-sitemap] Wrote ${pageEntries.length} URLs to ${sitemapPath}`);
}

main().catch((error) => {
  console.error('[generate-sitemap] Failed to build sitemap', error);
  process.exitCode = 1;
});
