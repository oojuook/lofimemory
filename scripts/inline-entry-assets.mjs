import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');

const mimeTypes = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

if (!fs.existsSync(indexPath)) {
  throw new Error(`[inline-entry-assets] Missing ${indexPath}`);
}

let html = fs.readFileSync(indexPath, 'utf8');
let inlined = 0;
let inlinedImages = 0;
const imageCache = new Map();

function assetToDataUri(assetPath) {
  if (assetPath.startsWith('data:')) return assetPath;

  const normalizedAssetPath = assetPath.replace(/^\.\//, '').replace(/^\//, '');
  const candidatePaths = normalizedAssetPath.startsWith('assets/')
    ? [path.join(distDir, normalizedAssetPath)]
    : [path.join(distDir, normalizedAssetPath), path.join(distDir, 'assets', normalizedAssetPath)];
  const absoluteAssetPath = candidatePaths.find((candidatePath) => fs.existsSync(candidatePath));

  if (!absoluteAssetPath) return assetPath;

  const cacheKey = path.relative(distDir, absoluteAssetPath);
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const extension = path.extname(absoluteAssetPath).toLowerCase();
  const mimeType = mimeTypes[extension];
  if (!mimeType) return assetPath;

  const encoded = fs.readFileSync(absoluteAssetPath).toString('base64');
  const dataUri = `data:${mimeType};base64,${encoded}`;
  imageCache.set(cacheKey, dataUri);
  inlinedImages += 1;
  return dataUri;
}

function inlineReferencedImages(source) {
  const withImportMetaImages = source.replace(/new URL\(`([^`]+\.(?:png|jpe?g|webp|svg|ico))`,import\.meta\.url\)\.href/g, (_match, assetPath) => JSON.stringify(assetToDataUri(assetPath)));

  return withImportMetaImages.replace(/(?:\.\/|\/)?assets\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|svg|ico)/g, (assetPath) => assetToDataUri(assetPath));
}

html = html.replace(/<link\s+rel="stylesheet"\s+crossorigin\s+href="\.\/(assets\/[^"]+\.css)">/g, (_match, assetPath) => {
  const cssPath = path.join(distDir, assetPath);
  const css = inlineReferencedImages(fs.readFileSync(cssPath, 'utf8'));
  inlined += 1;
  return `<style data-inline-asset="${assetPath}">\n${css}\n</style>`;
});

html = inlineReferencedImages(html);

fs.writeFileSync(indexPath, html);
console.log(`[inline-entry-assets] Inlined ${inlined} entry asset(s) and ${inlinedImages} optimized image asset(s) into dist/index.html`);
