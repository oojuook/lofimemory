import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = 'https://lofimemory.vercel.app';

const coreIndexedPages = [
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
];

const approvedArticlePages = [
  'article-benefits-of-private-online-diary.html',
  'article-brain-dumping-sleep.html',
  'article-daily-word-puzzles-relax.html',
  'article-digital-journal-distractions.html',
  'article-how-to-start-journaling-habit.html',
  'article-journaling-prompts-self-discovery.html',
  'article-memory-games-cognitive-relief.html',
  'article-protect-privacy-journaling-online.html',
  'article-psychology-of-journaling.html',
  'article-study-break-routine-students.html',
  'student-focus-kit.html',
  'private-journaling-hub.html',
  'lofi-study-room-focus-tree-timer.html',
  'stop-scrolling-and-start-studying.html',
  'journaling-games-long-tail-seo.html',
  'how-does-journaling-help-with-thinking.html',
  'how-does-journaling-help-mental-health.html',
  'how-journaling-makes-you-better.html',
  'journaling-pros-and-cons.html',
  'journaling-for-students-who-overthink.html',
  'games-to-play-when-your-brain-is-tired.html',
  'relaxing-games-with-lofi-music-and-journaling.html',
  'article-word-guessing-games-busy-mind.html'
];

const alwaysIgnored = new Set([
  '404.html',
  'google5226abd8d86c0ece.html',
  'googled1931b3f15730e0b.html'
]);

function getLastMod(fileName) {
  if (fileName === 'index.html') return new Date().toISOString();
  return '2026-10-19T00:00:00.000Z';
}

function getPriority(fileName) {
  if (fileName === 'index.html') return '1.0';
  if (fileName === 'blog.html') return '0.92';
  if (approvedArticlePages.includes(fileName)) return '0.86';
  if (['about.html', 'contact.html', 'privacy.html', 'terms.html'].includes(fileName)) return '0.84';
  return '0.72';
}

function getChangeFreq(fileName) {
  if (fileName === 'index.html' || fileName === 'blog.html') return 'weekly';
  return 'monthly';
}

async function main() {
  const entries = await fs.readdir(publicDir, { withFileTypes: true });
  const htmlFiles = new Set(entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name));
  const pages = [...coreIndexedPages, ...approvedArticlePages].filter((fileName, index, list) => (fileName === 'index.html' || htmlFiles.has(fileName)) && !alwaysIgnored.has(fileName) && list.indexOf(fileName) === index);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((fileName) => {
      const loc = fileName === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${fileName}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${getLastMod(fileName)}</lastmod>\n    <changefreq>${getChangeFreq(fileName)}</changefreq>\n    <priority>${getPriority(fileName)}</priority>\n  </url>`;
    })
    .join('\n')}\n</urlset>\n`;

  await fs.writeFile(sitemapPath, sitemap, 'utf8');
  console.log(`[generate-sitemap] Wrote ${pages.length} URLs to ${sitemapPath}`);
}

main().catch((error) => {
  console.error('[generate-sitemap] Failed to generate sitemap.', error);
  process.exitCode = 1;
});
