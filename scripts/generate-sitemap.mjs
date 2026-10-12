import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = 'https://lofimemory.vercel.app';

const curatedPages = [
  'blog.html',
  'about.html',
  'editorial-policy.html',
  'advertising-policy.html',
  'contact.html',
  'privacy.html',
  'cookie-policy.html',
  'terms.html',
  'lofi-music-room.html',
  'lofi-radio-online.html',
  'listen-to-lofi-music-online.html',
  'relaxing-browser-games.html',
  'games-to-relax.html',
  '2048-online.html',
  'solitaire-online.html',
  'minesweeper-online.html',
  'browser-tetris-game.html',
  'snake-game-online.html',
  'wordle-online.html',
  'typing-test-online.html',
  'sudoku-online.html',
  'daily-journaling-app.html',
  'write-diary-online.html',
  'private-online-diary.html',
  'online-diary-with-lock.html',
  'journal-prompts.html',
  'mental-health-journal-online.html',
  'mood-journal.html',
  'memories-calendar.html',
  'daily-self-care-journal.html',
  'relaxing-games-with-music.html',
  'chill-place-online.html'
];

function getPriority(fileName) {
  if (fileName === 'index.html') return '1.0';
  if (['blog.html', 'about.html', 'privacy.html', 'terms.html'].includes(fileName)) return '0.9';
  if (fileName.startsWith('article-')) return '0.72';
  if (['lofi-music-room.html', 'relaxing-browser-games.html', 'daily-journaling-app.html', 'write-diary-online.html', 'private-online-diary.html'].includes(fileName)) return '0.88';
  return '0.8';
}

function toUrl(fileName) {
  if (fileName === 'index.html') return `${baseUrl}/`;
  return `${baseUrl}/${fileName}`;
}

function xmlEntry(fileName) {
  return [
    '  <url>',
    `    <loc>${toUrl(fileName)}</loc>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${getPriority(fileName)}</priority>`,
    '  </url>'
  ].join('\n');
}

async function main() {
  const allFiles = await fs.readdir(publicDir);
  const articles = allFiles
    .filter((file) => file.startsWith('article-') && file.endsWith('.html'))
    .sort();

  const selectedFiles = ['index.html', ...curatedPages, ...articles];
  const dedupedFiles = [...new Set(selectedFiles)].filter((file) => allFiles.includes(file));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...dedupedFiles.map(xmlEntry),
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
