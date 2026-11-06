#!/usr/bin/env node
/*
 * tools/page-images.js - the bench's own quick copies of the page images, so that reading does not
 * depend on the library's image service, which answers 429 (too many requests) when it is asked for
 * many images. Cut from the working repository's copies of the National Diet Library's scans
 * (source/guzensei-pages/page_NNN.jpg, spreads 1800 pixels wide): img/pages/NNN.webp (560 wide, beside
 * the text) and NNN-large.webp (the half spread, for the enlarged page), and img/spreads/NNN.webp (a
 * thumbnail of each spread). The full resolution stays with the library, fetched only on zooming.
 *
 *   node tools/page-images.js <working repository>
 *
 * An odd page is the left half of image (p + 13) / 2, an even page the right half of image (p + 14) / 2.
 * Uses cwebp for the cuts and sizes, and macOS's sips to read each image's size; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const src = process.argv[2];
if (!src) { console.error('usage: node tools/page-images.js <working repository>'); process.exit(1); }
const SP = path.join(src, 'source/guzensei-pages'), OUT = path.join(__dirname, '..', 'img');
const cwebp = (...a) => execFileSync('cwebp', ['-quiet', ...a], { stdio: 'ignore' });
const size = (f) => { const t = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', f], { encoding: 'utf8' }); return [+/pixelWidth: (\d+)/.exec(t)[1], +/pixelHeight: (\d+)/.exec(t)[1]]; };
const pad = (n) => String(n).padStart(3, '0');
fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'spreads'), { recursive: true });
let pages = 0, spreads = 0;
for (let p = 1; p <= 331; p++) {
  const img = p % 2 ? (p + 13) / 2 : (p + 14) / 2, f = path.join(SP, 'page_' + pad(img) + '.jpg');
  if (!fs.existsSync(f)) { console.error('no image for p. ' + p + ': ' + f); process.exit(1); }
  const [w, h] = size(f), half = Math.floor(w / 2), x = p % 2 ? 0 : w - half;
  cwebp('-q', '60', '-crop', String(x), '0', String(half), String(h), f, '-o', path.join(OUT, 'pages', pad(p) + '-large.webp'));
  cwebp('-q', '55', '-crop', String(x), '0', String(half), String(h), '-resize', '560', '0', f, '-o', path.join(OUT, 'pages', pad(p) + '.webp'));
  pages++;
}
for (let i = 1; i <= 174; i++) {
  const f = path.join(SP, 'page_' + pad(i) + '.jpg');
  if (!fs.existsSync(f)) continue;
  cwebp('-q', '55', '-resize', '320', '0', f, '-o', path.join(OUT, 'spreads', pad(i) + '.webp')); spreads++;
}
console.log(pages + ' pages, ' + spreads + ' spreads');
