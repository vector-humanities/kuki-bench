#!/usr/bin/env node
/*
 * tools/ndl-copies.js - the bench's own copies of the whole book's images, at full resolution, so that
 * nothing in it depends on the library's image service, which answers 429 (too many requests).
 * Fetches each of the 174 images of National Diet Library pid 1037966 (public domain) through its IIIF
 * service, one at a time with a pause, waiting and retrying on 429 or a failed fetch, into _tmp/ndl-full/
 * (not published; a rerun fetches only what is missing). Then writes:
 *   img/full/NNN.webp          each spread at full resolution
 *   img/pages/PPP-full.webp    each page at full resolution (an odd page the left half of image
 *                              (p + 13) / 2, an even page the right half of image (p + 14) / 2)
 *   img/provenance.csv         each spread's source URL, its size and the day it was fetched
 *
 *   node tools/ndl-copies.js [--pause 2000]
 * Needs Node 18 or later and cwebp; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const arg = process.argv.indexOf('--pause'), PAUSE = arg > 0 ? +process.argv[arg + 1] : 2000;
const ROOT = path.join(__dirname, '..'), RAW = path.join(ROOT, '_tmp/ndl-full'), IMG = path.join(ROOT, 'img');
const pad = (n, w) => String(n).padStart(w || 3, '0'), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = (i) => 'https://dl.ndl.go.jp/api/iiif/1037966/R' + pad(i, 7) + '/full/full/0/default.jpg';
const cwebp = (...a) => execFileSync('cwebp', ['-quiet', ...a], { stdio: 'ignore' });
const dims = (f) => { const b = fs.readFileSync(f); let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + b.readUInt16BE(i + 2); } throw new Error('no size in ' + f); };

async function fetchOne(i) {
  const f = path.join(RAW, pad(i) + '.jpg');
  if (fs.existsSync(f)) return false;
  for (let wait = 30000, tries = 0; ; wait = Math.min(wait * 2, 600000), tries++) {
    try {
      const r = await fetch(url(i));
      if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error('not a JPEG'); fs.writeFileSync(f + '.part', b); fs.renameSync(f + '.part', f); return true; }
      console.log('image ' + i + ': HTTP ' + r.status + ', waiting ' + wait / 1000 + 's');
      if (r.status !== 429 && r.status < 500) throw new Error('HTTP ' + r.status);
    } catch (e) { if (/HTTP 4/.test(e.message) || tries > 8) throw e; console.log('image ' + i + ': ' + e.message + ', waiting ' + wait / 1000 + 's'); }
    await sleep(wait);
  }
}
(async () => {
  fs.mkdirSync(RAW, { recursive: true }); fs.mkdirSync(path.join(IMG, 'full'), { recursive: true }); fs.mkdirSync(path.join(IMG, 'pages'), { recursive: true });
  for (let i = 1; i <= 174; i++) { const got = await fetchOne(i); if (got) { if (i % 10 === 0) console.log('fetched to ' + i); await sleep(PAUSE); } }
  console.log('all 174 fetched; writing copies');
  const today = new Date().toISOString().slice(0, 10), rows = ['image,file,width,height,source,fetched,credit'];
  for (let i = 1; i <= 174; i++) {
    const f = path.join(RAW, pad(i) + '.jpg'), [w, h] = dims(f);
    cwebp('-q', '72', f, '-o', path.join(IMG, 'full', pad(i) + '.webp'));
    rows.push([i, 'img/full/' + pad(i) + '.webp', w, h, url(i), today, '国立国会図書館 National Diet Library, JAPAN'].join(','));
  }
  fs.writeFileSync(path.join(IMG, 'provenance.csv'), rows.join('\n') + '\n');
  for (let p = 1; p <= 331; p++) {
    const i = p % 2 ? (p + 13) / 2 : (p + 14) / 2, f = path.join(RAW, pad(i) + '.jpg'), [w, h] = dims(f), half = Math.floor(w / 2);
    cwebp('-q', '72', '-crop', String(p % 2 ? 0 : w - half), '0', String(half), String(h), f, '-o', path.join(IMG, 'pages', pad(p) + '-full.webp'));
  }
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
