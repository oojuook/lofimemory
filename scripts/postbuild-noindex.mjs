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
const keywordsMetaPattern = /\s*<meta\s+name=["']keywords["'][^>]*>\s*/gi;
const reviewModeDisclosureOld = '<p style="margin:6px 0;"><strong>Advertising Disclosure:</strong> Lofi Memory may display advertisements (including Google AdSense) to support free access to the site. We prioritize editorial independence and a calm user experience. See our <a href="/advertising-policy.html">Advertising Policy</a> for details.</p>';
const reviewModeDisclosureNew = '<p style="margin:6px 0;"><strong>Site review mode:</strong> Advertising is currently disabled while Lofi Memory is being reviewed for approval. If ads are enabled later, they will remain secondary to content and follow the <a href="/advertising-policy.html">Advertising Policy</a>.</p>';
const reviewCookieNoticeOld = 'We use cookies and browser storage to keep Lofi Memory smooth and support ads. By staying here, you agree to our <a href="/privacy.html">Privacy Policy</a>, <a href="/terms.html">Terms</a>, and <a href="/cookie-policy.html">Cookie Policy</a>.';
const reviewCookieNoticeNew = 'We use cookies and browser storage to keep Lofi Memory smooth while the site is under review. By continuing, you agree to our <a href="/privacy.html">Privacy Policy</a>, <a href="/terms.html">Terms</a>, and <a href="/cookie-policy.html">Cookie Policy</a>.';

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
      html = html.replace(keywordsMetaPattern, '\n');
      html = html.replaceAll(reviewModeDisclosureOld, reviewModeDisclosureNew);
      html = html.replaceAll(reviewCookieNoticeOld, reviewCookieNoticeNew);
      html = html.replaceAll('Last reviewed: October 2026.', 'Last reviewed: November 2026.');
      html = html.replaceAll('Last reviewed: October 2026', 'Last reviewed: November 2026');
      html = html.replaceAll('Last updated: October 2026', 'Last updated: November 2026');
      html = html.replaceAll('For questions related to ads shown on the site, include the ad details, page URL, approximate time, and your country or region if relevant.', 'For questions about future advertising or monetization on the site, include the page URL, approximate time, and your country or region if relevant.');
      html = html.replaceAll('Lofi Memory may show third-party advertising and link to external services such as Google, Firebase, YouTube, or advertiser websites.', 'Lofi Memory may show third-party advertising after approval and link to external services such as Google, Firebase, YouTube, or advertiser websites.');
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
