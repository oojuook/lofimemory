import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = 'https://lofimemory.vercel.app';

const pinnedPages = [
  'index.html',
  'blog.html',
  'about.html',
  'lofi-music-room.html',
  'lofi-radio-online.html',
  'listen-to-lofi-music-online.html',
  'lofi-music-for-studying.html',
  'study-timer-with-music.html',
  'relaxing-browser-games.html',
  'calming-games-online.html',
  'cozy-browser-games.html',
  'no-download-browser-games.html',
  'games-to-play-when-bored.html',
  'games-to-relax.html',
  'lofi-games.html',
  'solitaire-online.html',
  'minesweeper-online.html',
  'snake-game-online.html',
  'wordle-online.html',
  'typing-test-online.html',
  'sudoku-online.html',
  'daily-journaling-app.html',
  'free-online-diary.html',
  'private-diary-no-signup.html',
  'private-journal-app.html',
  'write-diary-online.html',
  'private-online-diary.html',
  'online-diary-with-lock.html',
  'journal-prompts.html',
  'journal-prompts-self-discovery.html',
  'mental-health-journal-online.html',
  'mood-journal.html',
  'mood-tracker-journal.html',
  'memories-calendar.html',
  'daily-self-care-journal.html',
  'relaxing-games-with-music.html',
  'chill-place-online.html'
];

const excludedPages = new Set([
  'logo-preview.html',
  'google5226abd8d86c0ece.html',
  'googled1931b3f15730e0b.html'
]);

function getPriority(fileName) {
  if (fileName === 'index.html') return '1.0';
  if (['blog.html', 'about.html', 'privacy.html', 'terms.html', 'contact.html'].includes(fileName)) return '0.9';
  if (fileName.startsWith('article-')) return '0.74';
  if (fileName.includes('journal') || fileName.includes('diary')) return '0.86';
  if (fileName.includes('game') || fileName.includes('solitaire') || fileName.includes('minesweeper') || fileName.includes('snake') || fileName.includes('wordle') || fileName.includes('sudoku') || fileName.includes('typing')) return '0.86';
  if (fileName.includes('lofi') || fileName.includes('music') || fileName.includes('relax')) return '0.84';
  return '0.76';
}

function getChangeFreq(fileName) {
  if (fileName === 'index.html' || fileName === 'blog.html') return 'weekly';
  if (fileName.startsWith('article-')) return 'monthly';
  if (fileName.includes('policy') || ['privacy.html', 'terms.html'].includes(fileName)) return 'yearly';
  return 'monthly';
}

function toUrl(fileName) {
  if (fileName === 'index.html') return `${baseUrl}/`;
  return `${baseUrl}/${fileName}`;
}

function xmlEntry(fileName) {
  const stats = fs.stat(path.join(publicDir, fileName));
  return stats.then((fileStat) => {
    const lastMod = fileStat.mtime.toISOString().slice(0, 10);
    return [
      '  <url>',
      `    <loc>${toUrl(fileName)}</loc>`,
      `    <lastmod>${lastMod}</lastmod>`,
      `    <changefreq>${getChangeFreq(fileName)}</changefreq>`,
      `    <priority>${getPriority(fileName)}</priority>`,
      '  </url>'
    ].join('\n');
  });
}

async function main() {
  const allFiles = await fs.readdir(publicDir);
  const htmlPages = allFiles
    .filter((file) => file.endsWith('.html'))
    .filter((file) => !excludedPages.has(file))
    .sort();

  const selectedFiles = [...pinnedPages, ...htmlPages];
  const dedupedFiles = [...new Set(selectedFiles)].filter((file) => allFiles.includes(file));

  const xmlEntries = await Promise.all(dedupedFiles.map(xmlEntry));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...xmlEntries,
    '</urlset>',
    ''
  ].join('\n');

  await fs.writeFile(sitemapPath, xml, 'utf8');
  console.log(`[generate-sitemap] Wrote ${dedupedFiles.length} URLs to ${sitemapPath}`);
}

main().catch((error) => {
  console.error('[generate-sitemap] Failed to generate sitemap.', error);
  process.exitCode = 1;
});
