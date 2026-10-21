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

const approvedArticlePages = new Set([
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
  'how-journaling-helps-with-overthinking.html',
  'how-journaling-helps-clear-your-head.html',
  'how-journaling-helps-students-focus.html',
  'how-to-journal-before-studying.html',
  'what-to-write-when-you-feel-overwhelmed.html',
  'is-online-journaling-safe.html',
  'how-to-journal-when-you-dont-know-what-to-write.html',
  'how-journaling-improves-your-thoughts.html',
  'benefits-of-writing-down-your-thoughts.html',
  'how-journaling-helps-decision-making.html',
  'daily-journal-prompts-for-students.html',
  'journaling-to-stop-procrastinating.html',
  'games-to-play-when-your-brain-is-tired.html',
  'no-download-games-for-study-breaks.html',
  'browser-games-for-short-breaks.html',
  'games-to-play-when-bored-but-not-distracted.html',
  'games-that-help-you-relax-after-studying.html',
  'quick-games-to-reset-your-brain.html',
  'calming-games-before-journaling.html',
  'relaxing-puzzle-games-for-overthinking.html',
  'study-break-games-that-dont-waste-time.html',
  'relaxing-games-with-lofi-music-and-journaling.html',
  'article-word-guessing-games-busy-mind.html'
]);

const alwaysKept = new Set([
  '404.html',
  'google5226abd8d86c0ece.html',
  'googled1931b3f15730e0b.html'
]);

const noindexMeta = '<meta name="robots" content="noindex, follow" />';
const adsenseScriptPattern = /\s*<script\s+async\s+src=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"']+["'][^>]*><\/script>\s*/gi;

function shouldIndex(fileName) {
  return coreIndexedPages.has(fileName) || approvedArticlePages.has(fileName);
}

function shouldKeepFile(fileName) {
  return shouldIndex(fileName) || alwaysKept.has(fileName);
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
  let removedCount = 0;
  for (const entry of htmlFiles) {
    const filePath = path.join(distDir, entry.name);
    if (!shouldKeepFile(entry.name)) {
      await fs.unlink(filePath);
      removedCount += 1;
      continue;
    }

    const original = await fs.readFile(filePath, 'utf8');
    const updated = stripAdSenseFromLowValuePages(upsertRobotsMeta(original, entry.name), entry.name);
    if (updated !== original) {
      await fs.writeFile(filePath, updated, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(`[postbuild-noindex] Processed ${htmlFiles.length} html files, updated ${updatedCount}, removed ${removedCount} low-value html files from dist.`);
}

main().catch((error) => {
  console.error('[postbuild-noindex] Failed to update robots meta tags.', error);
  process.exitCode = 1;
});
