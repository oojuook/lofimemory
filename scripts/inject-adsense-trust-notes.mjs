import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

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
];

const trustBlock = `
      <section data-trust-note="adsense-review" style="padding:16px 0;">
        <div style="border:1px solid rgba(69,100,59,.14);background:rgba(255,255,255,.94);border-radius:28px;box-shadow:0 18px 50px rgba(47,70,58,.09);padding:24px;">
          <div style="display:inline-flex;border-radius:999px;background:#e6efe8;color:#284a3a;padding:8px 14px;font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;">Trust and transparency</div>
          <h2 style="margin:16px 0 10px;font-size:clamp(1.4rem,3vw,2rem);line-height:1.15;color:#24342d;">Review the site before you use the app.</h2>
          <p style="margin:0;color:#5f7267;line-height:1.75;">Lofi Memory is maintained as an independent browser project for private journaling, calm study breaks, lofi music, and low-pressure games. If you want to check how the site handles privacy, advertising, content standards, corrections, or support, start with the pages below before saving content or interacting with ads.</p>
          <p style="margin:14px 0 0;color:#284a3a;line-height:1.8;"><a href="/about.html" style="color:#284a3a;font-weight:800;">About</a> · <a href="/editorial-policy.html" style="color:#284a3a;font-weight:800;">Editorial Policy</a> · <a href="/content-quality-policy.html" style="color:#284a3a;font-weight:800;">Content Quality</a> · <a href="/privacy.html" style="color:#284a3a;font-weight:800;">Privacy</a> · <a href="/advertising-policy.html" style="color:#284a3a;font-weight:800;">Advertising Policy</a> · <a href="/contact.html" style="color:#284a3a;font-weight:800;">Contact</a></p>
          <p style="margin:12px 0 0;color:#6a7e73;font-size:.95rem;line-height:1.7;">Last reviewed: October 2026.</p>
        </div>
      </section>
`;

function injectTrustBlock(html) {
  if (html.includes('data-trust-note="adsense-review"')) return html;

  if (html.includes('</main>')) {
    return html.replace('</main>', `${trustBlock}    </main>`);
  }

  if (html.includes('<footer')) {
    return html.replace('<footer', `${trustBlock}    <footer`);
  }

  if (html.includes('</body>')) {
    return html.replace('</body>', `${trustBlock}</body>`);
  }

  return html;
}

async function main() {
  let updatedCount = 0;

  for (const fileName of approvedArticlePages) {
    const filePath = path.join(publicDir, fileName);
    const html = await fs.readFile(filePath, 'utf8');
    const updated = injectTrustBlock(html);

    if (updated !== html) {
      await fs.writeFile(filePath, updated, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(`[inject-adsense-trust-notes] Updated ${updatedCount} page(s).`);
}

main().catch((error) => {
  console.error('[inject-adsense-trust-notes] Failed to update article trust blocks.', error);
  process.exitCode = 1;
});
