#!/usr/bin/env node
/* tools/page-iiif.js - the Vision reading of each page (tools/page-ocr.swift, _tmp/ocr/raw/NNN.json) as IIIF
 * annotations on the National Diet Library's own canvases for pid 1037966: one AnnotationPage to a page, each
 * column of text an Annotation with motivation "supplementing", its words as a TextualBody (language ja) and
 * its place as a fragment of the spread's canvas (#xywh=x,y,w,h, in the canvas's pixels).
 * W3C Web Annotation in the IIIF Presentation 3 context; viewers such as Mirador read it beside the library's
 * manifest (_tmp/ocr/ndl-manifest.json, https://dl.ndl.go.jp/api/iiif/1037966/manifest.json).
 *
 * Each page image is exactly half its canvas: an odd page the left half of image (p + 13) / 2, an even page
 * the right half of image (p + 14) / 2, so a box on an even page moves right by the canvas's width less the
 * half. The reading is Vision's, uncorrected: columns in reading order (right to left, top to bottom), the
 * running head and the page number included, characters sometimes misread (的 as 約 and the like).
 *
 *   node tools/page-iiif.js [--out <folder>] [--base <url>] [pages]
 *   --out   where to write page-N.json (_tmp/ocr/iiif if not given)
 *   --base  the address the files will be served from, for their ids (a urn if not given)
 *   pages   e.g. 1-11,81 (all of 1-331 if not given)
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OCR = path.join(ROOT, '_tmp/ocr');
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const OUT = path.resolve(opt('--out') || path.join(OCR, 'iiif')), BASE = opt('--base');
const list = (() => {
  if (!args[0]) return Array.from({ length: 331 }, (_, i) => i + 1);
  const out = [];
  args[0].split(',').forEach((r) => { const m = r.split('-').map(Number); for (let p = m[0]; p <= (m[1] || m[0]); p++) out.push(p); });
  return out;
})();
const pad = (p) => String(p).padStart(3, '0');
const M = JSON.parse(fs.readFileSync(path.join(OCR, 'ndl-manifest.json'), 'utf8'));
const canvases = M.sequences[0].canvases;
const id = (p, k) => (BASE ? BASE.replace(/\/?$/, '/') + 'page-' + p + '.json' : 'urn:kuki-1948:ocr:page-' + p) + (k == null ? '' : '#' + k);

fs.mkdirSync(OUT, { recursive: true });
let pages = 0, notes = 0;
list.forEach((p) => {
  const f = path.join(OCR, 'raw', pad(p) + '.json');
  if (!fs.existsSync(f)) return;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const img = p % 2 ? (p + 13) / 2 : (p + 14) / 2, c = canvases[img - 1];
  if (j.w !== Math.floor(c.width / 2) || j.h !== c.height) { console.error('p. ' + p + ': the image is not half its canvas; left out'); return; }
  const dx = p % 2 ? 0 : c.width - j.w;
  // reading order: columns right to left, the pieces of a column top to bottom
  const mid = (l) => (l.box[0] + l.box[2]) / 2, w = (l) => l.box[2] - l.box[0];
  const lines = j.lines.filter((l) => l.text.trim()).sort((a, b) => {
    const near = Math.abs(mid(a) - mid(b)) < 0.5 * Math.min(w(a), w(b));
    return near ? a.box[1] - b.box[1] : mid(b) - mid(a);
  });
  const items = lines.map((l, k) => {
    const [x0, y0, x1, y1] = l.box.map(Math.round);
    return {
      id: id(p, 'c' + (k + 1)), type: 'Annotation', motivation: 'supplementing',
      body: { type: 'TextualBody', value: l.text, language: 'ja', format: 'text/plain' },
      target: c['@id'] + '#xywh=' + [x0 + dx, y0, x1 - x0, y1 - y0].join(',')
    };
  });
  const page = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: id(p), type: 'AnnotationPage',
    label: { en: ['1948 printing, p. ' + p + ': the text as read by macOS Vision, uncorrected'] },
    partOf: [{ id: M['@id'], type: 'Manifest' }],
    items
  };
  fs.writeFileSync(path.join(OUT, 'page-' + p + '.json'), JSON.stringify(page, null, 1) + '\n');
  pages++; notes += items.length;
});
console.log(pages + ' pages, ' + notes + ' annotations, in ' + path.relative(process.cwd(), OUT));
