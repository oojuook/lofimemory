import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`[inline-entry-assets] Missing ${indexPath}`);
}

let html = fs.readFileSync(indexPath, 'utf8');
let inlined = 0;

html = html.replace(/<link\s+rel="stylesheet"\s+crossorigin\s+href="\.\/(assets\/[^\"]+\.css)">/g, (_match, assetPath) => {
  const cssPath = path.join(distDir, assetPath);
  const css = fs.readFileSync(cssPath, 'utf8');
  inlined += 1;
  return `<style data-inline-asset="${assetPath}">\n${css}\n</style>`;
});

html = html.replace(/<script\s+type="module"\s+crossorigin\s+src="\.\/(assets\/[^\"]+\.js)"><\/script>/g, (_match, assetPath) => {
  const jsPath = path.join(distDir, assetPath);
  const js = fs.readFileSync(jsPath, 'utf8')
    .replace(/<\/script/gi, '<\\/script')
    .replace(/<!--/g, '<\\!--');
  inlined += 1;
  return `<script type="module" data-inline-asset="${assetPath}">\n${js}\n</script>`;
});

fs.writeFileSync(indexPath, html);
console.log(`[inline-entry-assets] Inlined ${inlined} entry asset(s) into dist/index.html`);
