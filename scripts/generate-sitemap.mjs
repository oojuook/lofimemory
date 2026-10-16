import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const baseUrl = 'https://lofimemory.vercel.app';

const indexedPages = [
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
  'sitemap.html',
  'aesthetic-study-breaks.html',
  'lofi-study-room.html',
  'aesthetic-student-diary.html',
  'mindful-reflection-guide.html',
  'study-break-games-and-journal.html',
  'private-journaling-hub.html',
  'relaxing-games-hub.html',
  'lofi-focus-hub.html',
  'online-diary-for-students.html',
  'aesthetic-online-journal.html',
  'online-notes-with-reminders.html',
  'private-memory-calendar.html',
  'daily-planner-with-journal.html',
  'self-care-reminder-app.html',
  'pomodoro-timer-with-lofi.html',
  'cozy-games-for-study-breaks.html',
  'relaxing-browser-games.html',
  'solitaire-online.html',
  'minesweeper-online.html',
  'snake-game-online.html',
  'daily-word-puzzle.html',
  'sudoku-online.html',
  'typing-test-online.html',
  'lofi-music-for-studying.html',
  'study-timer-with-music.html'
];

const alwaysIgnored = new Set([
  'google5226abd8d86c0ece.html',
  'googled1931b3f15730e0b.html'
]);

function getLastMod(fileName) {
  if (fileName === 'index.html') return new Date().toISOString();
  if (fileName === 'blog.html') return '2026-10-16T00:00:00.000Z';
  if (fileName.includes('guide') || fileName.includes('study') || fileName.includes('journal')) return '2026-10-16T00:00:00.000Z';
  return '2026-10-15T00:00:00.000Z';
}

function getPriority(fileName) {
  if (fileName === 'index.html') return '1.0';
  if (['blog.html', 'about.html', 'contact.html', 'sitemap.html', 'privacy.html', 'terms.html'].includes(fileName)) return '0.9';
  if (fileName.includes('hub')) return '0.88';
  if (fileName.includes('journal') || fileName.includes('diary')) return '0.86';
  if (fileName.includes('game') || fileName.includes('solitaire') || fileName.includes('minesweeper') || fileName.includes('snake') || fileName.includes('sudoku') || fileName.includes('typing') || fileName.includes('word')) return '0.84';
  if (fileName.includes('study') || fileName.includes('lofi') || fileName.includes('timer')) return '0.84';
  return '0.72';
}

function getChangeFreq(fileName) {
  if (fileName === 'index.html') return 'weekly';
  if (fileName === 'blog.html') return 'weekly';
  if (fileName.includes('game') || fileName.includes('hub')) return 'monthly';
  return 'monthly';
}

async function main() {
  const entries = await fs.readdir(publicDir, { withFileTypes: true });
  const htmlFiles = new Set(entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name));

  const pages = indexedPages.filter((fileName) => htmlFiles.has(fileName) && !alwaysIgnored.has(fileName));

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
