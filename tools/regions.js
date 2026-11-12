#!/usr/bin/env node
/* tools/regions.js - highlight links: where each sentence of the readable translation lies on its page of the 1948 printing,
 * for Book's doc.regions (kit/book.js): regions/N.json, one file to a page (N the page, as in its [p. N] marker).
 *
 * The places are estimated. The text of a page in the translation runs from its [p. N] marker to the next;
 * the Japanese of the page is read from the page image by macOS Vision (tools/page-ocr.swift), its columns
 * right to left. Each English sentence (or the part of it on the page) is given the same share of the page's
 * Japanese as it has of the page's English, and its two ends are moved to the nearest end of a Japanese
 * sentence (。) where one lies close by. The boxes are the columns that share runs over.
 *
 *   swiftc -O tools/page-ocr.swift -o _tmp/ocr/page-ocr          once
 *   node tools/regions.js ocr [pages]      read the pages' images into _tmp/ocr/raw/NNN.json
 *   node tools/regions.js [pages]          write regions/N.json from them
 *   pages: e.g. 1-11,60,81 (all of 1-331 if not given)
 *
 * Uses dwebp for the images; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const TR = path.join(ROOT, 'translation/Kuki_Problem-of-Contingency_translation.md');
const OCR = path.join(ROOT, '_tmp/ocr');
const OUT = path.join(ROOT, 'regions');
const SNAP = 0.07;   // how far (a share of the page) an end may move to meet the end of a Japanese sentence

function pages(arg) {
  if (!arg) return Array.from({ length: 331 }, (_, i) => i + 1);
  const out = [];
  arg.split(',').forEach((r) => { const m = r.split('-').map(Number); for (let p = m[0]; p <= (m[1] || m[0]); p++) out.push(p); });
  return out;
}
const pad = (p) => String(p).padStart(3, '0');
const median = (a) => { a = a.slice().sort((x, y) => x - y); return a[a.length >> 1]; };

// ---- the Japanese: the page's characters in reading order, each with its column and box
function japanese(p) {
  const f = path.join(OCR, 'raw', pad(p) + '.json');
  if (!fs.existsSync(f)) return null;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  let lines = j.lines.filter((l) => l.box[3] - l.box[1] > l.box[2] - l.box[0]);   // vertical
  if (!lines.length) return { size: [j.w, j.h], chars: [] };
  const w = median(lines.map((l) => l.box[2] - l.box[0]));
  // the running head and the page number are set smaller: narrower than the text's columns
  lines = lines.filter((l) => l.box[2] - l.box[0] >= 0.6 * w && [...l.text].length > 2);
  const mid = (l) => (l.box[0] + l.box[2]) / 2;
  lines.sort((a, b) => mid(b) - mid(a));
  const cols = [];
  lines.forEach((l) => { const c = cols[cols.length - 1]; if (c && Math.abs(mid(c[0]) - mid(l)) < 0.5 * w) c.push(l); else cols.push([l]); });
  // a heading: a short column set lower than the text, opening with a numeral (一 … 十, 第, a digit)
  const top = median(lines.map((l) => l.box[1])), len = median(cols.map((c) => c.reduce((n, l) => n + [...l.text].length, 0)));
  const isHead = (c) => { const t = c.map((l) => l.text).join(''), y = Math.min(...c.map((l) => l.box[1]));
    return [...t].length < 0.6 * len && y > top + 1.5 * w && /^[一二三四五六七八九十第0-9０-９序結ニー]/.test(t.trim()); };
  const chars = [], heads = [];
  cols.forEach((c) => { if (isHead(c)) { heads.push(chars.length); return; }
    c.sort((a, b) => a.box[1] - b.box[1]).forEach((l) => {
      // a space has no box ([0, 0, 0, 0] from Vision), and nor has any character with no area
      [...l.text].forEach((ch, i) => { const b = l.chars[i]; if (!/\s/.test(ch)) chars.push({ ch, line: l, box: b && b[2] > b[0] && b[3] > b[1] ? b : null }); });
    }); });
  return { size: [j.w, j.h], chars, heads };
}

// ---- the English: the author's text as Book sets it, cut into sentences, each with its pages
function english() {
  const src = fs.readFileSync(TR, 'utf8').split('\n');
  const a = src.findIndex((l) => /^## Author/.test(l)), b = src.findIndex((l, i) => i > a && /^#+ (Appendix|Glossary)/.test(l));
  // prose only: no notes, figures, rules, comments or ::: fences; a heading stays as a mark, where the
  // page's Japanese has its heading; a list item or quotation without its mark, as Book sets it
  const prose = src.slice(a, b).filter((l) => l.trim() && !/^(\[\^|!\[|<!--|---|:::|\*\*Figure|\*Figure|Figure \d)/.test(l.trim()))
    .map((l) => /^#/.test(l) ? '\u0001' + (l.match(/\[p\. \d+\]/g) || []).join(' ') : l.replace(/^\s*(?:>\s*)+/, '').replace(/^\s*[-+]\s+/, ''));
  // one stream, the page markers kept as tokens; footnote marks and image markers out
  let text = prose.join('\n').replace(/\[\^[^\]]+\]/g, '').replace(/\s*\[コマ \d+\]/g, '').replace(/\*/g, '');   // Book ignores * in matching
  const tokens = text.split(/(\[p\. \d+\]|\u0001)/);
  let page = 0, flat = '', at = [], heads = [];   // at: [offset, page] where each page begins; heads: offsets of headings
  tokens.forEach((t) => { const m = /^\[p\. (\d+)\]$/.exec(t); if (m) { page = +m[1]; at.push([flat.length, page]); } else if (t === '\u0001') heads.push(flat.length); else flat += t; });
  // sentences: an end . ? ! (and any closing quote or bracket), then a space; not after the common abbreviations.
  // Every line ends one too (a paragraph, a list item, a line of a scheme are each set apart)
  const sents = [], abbr = /(?:\b(?:cf|e\.g|i\.e|pp|vol|vols|ed|eds|trans|Tr|viz|etc|Bd|Bde|ch|no|op|cit|ibid|Mr|Dr|St|vs|ff|fig|hrsg|Hrsg|Aufl|Ausg|usw|bzw|vgl|Vgl|ders|ebd|éd|trad|chap|cap|tom|Anm)|\b[A-Za-z]|\b[IVX]{1,4})\.$/;
  let s0 = 0;
  const re = /[.?!][”’"')\]〕」』]*(?=\s+|$)|(?=\n)/g; let m;
  while ((m = re.exec(flat))) {
    if (!m[0]) { if (re.lastIndex === m.index) re.lastIndex++; if (flat.slice(s0, m.index).trim()) { sents.push([s0, m.index]); } s0 = m.index; while (/\s/.test(flat[s0] || '')) s0++; continue; }
    const end = m.index + m[0].length;
    if (abbr.test(flat.slice(Math.max(0, m.index - 6), m.index + 1))) continue;
    sents.push([s0, end]); s0 = end; while (/\s/.test(flat[s0] || '')) s0++;
  }
  if (s0 < flat.length) sents.push([s0, flat.length]);
  const pageAt = {}; at.forEach(([off, p], i) => { pageAt[p] = [off, i + 1 < at.length ? at[i + 1][0] : flat.length]; });
  return { flat, sents, pageAt, heads };
}

// the English from e0 to e1 laid over the Japanese characters from j0 to j1, sentence by sentence
function place(E, J, e0, e1, j0, j1, regions) {
  const eLen = e1 - e0, jLen = j1 - j0;
  if (eLen <= 0 || jLen <= 0) return;
  // where Japanese sentences end, as shares of the stretch
  const ends = [0, 1];
  for (let i = j0; i < j1; i++) if (/[。？！]/.test(J.chars[i].ch)) { let k = i + 1; while (k < j1 && /[」』）)]/.test(J.chars[k].ch)) k++; ends.push((k - j0) / jLen); }
  const snap = (s) => { let best = s, d = SNAP; ends.forEach((b) => { if (Math.abs(b - s) <= d) { d = Math.abs(b - s); best = b; } }); return best; };
  E.sents.forEach(([a, b]) => {
    const x0 = Math.max(a, e0), x1 = Math.min(b, e1);
    if (x1 <= x0 || !E.flat.slice(x0, x1).trim()) return;
    let s0 = (x0 - e0) / eLen, s1 = (x1 - e0) / eLen;
    const t0 = snap(s0), t1 = snap(s1);
    if (t1 > t0) { s0 = t0; s1 = t1; }
    const c0 = j0 + Math.round(s0 * jLen), c1 = Math.max(c0 + 1, j0 + Math.round(s1 * jLen));
    const cs = J.chars.slice(c0, Math.min(c1, j1));
    const by = new Map();
    cs.forEach((c) => { if (!c.box) return; if (!by.has(c.line)) by.set(c.line, []); by.get(c.line).push(c.box); });
    const boxes = [...by].map(([l, bs]) => [l.box[0], Math.min(...bs.map((x) => x[1])), l.box[2], Math.max(...bs.map((x) => x[3]))].map(Math.round));
    if (!boxes.length) return;
    regions.push({ boxes, text: cs.map((c) => c.ch).join(''), quote: { translation: E.flat.slice(a, b).replace(/\s+/g, ' ').trim() }, est: true });
  });
}

function build(list) {
  const E = english();
  fs.mkdirSync(OUT, { recursive: true });
  const report = [];
  list.forEach((p) => {
    const J = japanese(p), span = E.pageAt[p];
    if (!J || !span || !J.chars.length) {
      // a blank page (p. 12) still has its file, with no places, so that Book does not ask for it in vain
      if (J) fs.writeFileSync(path.join(OUT, p + '.json'), JSON.stringify({ size: J.size, regions: [] }) + '\n');
      report.push(p + ': ' + (!J ? 'no OCR' : !span ? 'no [p. ' + p + ']' : 'no text read')); return;
    }
    const [e0, e1] = span;
    // the page cut at its headings, where both sides have the same number; else the page whole
    const eh = E.heads.filter((h) => h > e0 && h < e1), jh = J.heads.filter((h) => h > 0 && h < J.chars.length);
    const eCut = [e0].concat(eh.length === jh.length ? eh : [], [e1]), jCut = [0].concat(eh.length === jh.length ? jh : [], [J.chars.length]);
    const regions = [];
    for (let g = 0; g + 1 < eCut.length; g++) place(E, J, eCut[g], eCut[g + 1], jCut[g], jCut[g + 1], regions);
    fs.writeFileSync(path.join(OUT, p + '.json'), JSON.stringify({ size: J.size, regions }) + '\n');
    report.push(p + ': ' + regions.length + ' places');
  });
  console.log(report.join('\n'));
}

function ocr(list) {
  const bin = path.join(OCR, 'page-ocr');
  if (!fs.existsSync(bin)) { console.error('compile first: swiftc -O tools/page-ocr.swift -o _tmp/ocr/page-ocr'); process.exit(1); }
  fs.mkdirSync(path.join(OCR, 'png'), { recursive: true }); fs.mkdirSync(path.join(OCR, 'raw'), { recursive: true });
  list.forEach((p) => {
    const img = path.join(ROOT, 'img/pages', pad(p) + '-full.webp'), png = path.join(OCR, 'png', pad(p) + '.png');
    if (!fs.existsSync(img)) return;
    cp.execFileSync('dwebp', ['-quiet', img, '-o', png]);
    fs.writeFileSync(path.join(OCR, 'raw', pad(p) + '.json'), cp.execFileSync(bin, [png], { maxBuffer: 64 << 20 }));
    process.stdout.write(p + ' ');
  });
  console.log();
}

const args = process.argv.slice(2);
if (args[0] === 'ocr') ocr(pages(args[1])); else build(pages(args[0]));
