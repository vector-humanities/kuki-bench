#!/usr/bin/env node
/*
 * tools/page-trim.js - each page image's edges, measured, for Book's doc.trim: what lies outside the
 * paper in the National Diet Library's photographs (the white of the scanner, the black of the binding and
 * the facing page's edge) is trimmed from the image shown; the image itself is unchanged.
 * Reads img/pages/NNN.webp (560 wide) and writes js/page-trim.js: { page: { l, t, r, b } }, shares of the image.
 *
 *   node tools/page-trim.js            measure, write, and list the pages that differ from the run of the book
 *
 * The paper is the longest run of columns, then of rows within them, whose median brightness is neither
 * scanner white nor binding black; a run may cross a few darker lines. Uses dwebp; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const IMG = path.join(__dirname, '..', 'img', 'pages'), OUT = path.join(__dirname, '..', 'js', 'page-trim.js');
const WHITE = 254, BLACK = 135, GAP = 6;

function ppm(f) {
  const b = execFileSync('dwebp', ['-quiet', f, '-ppm', '-o', '-'], { maxBuffer: 1e8 });
  let i = 0; const t = [];
  while (t.length < 4) { let s = ''; while (b[i] > 32) s += String.fromCharCode(b[i++]); i++; t.push(s); }
  return { w: +t[1], h: +t[2], d: b.subarray(i) };
}
const median = (a) => { a.sort((x, y) => x - y); return a[a.length >> 1]; };
// the longest run of paper in a profile, crossing up to GAP lines that are not paper
function run(profile) {
  let best = [0, 0], start = -1, last = -1;
  profile.forEach((v, i) => {
    if (v < WHITE && v > BLACK) {
      if (start < 0 || i - last > GAP + 1) start = i;
      last = i;
      if (last - start > best[1] - best[0]) best = [start, last + 1];
    }
  });
  return best;
}
function measure(f) {
  const m = ppm(f), L = (x, y) => { const k = (y * m.w + x) * 3; return (m.d[k] + m.d[k + 1] + m.d[k + 2]) / 3; };
  const rows0 = []; for (let y = 0; y < m.h; y++) { const a = []; for (let x = 0; x < m.w; x += 4) a.push(L(x, y)); rows0.push(median(a)); }
  const r0 = run(rows0);
  const cols = []; for (let x = 0; x < m.w; x++) { const a = []; for (let y = r0[0]; y < r0[1]; y += 4) a.push(L(x, y)); cols.push(median(a)); }
  const c = run(cols);
  const rows = []; for (let y = 0; y < m.h; y++) { const a = []; for (let x = c[0]; x < c[1]; x += 4) a.push(L(x, y)); rows.push(median(a)); }
  const r = run(rows);
  const share = (v) => Math.round((v + 0.008) * 1000) / 1000;   // a little inside the edge: its corners are dark
  return { l: share(c[0] / m.w), t: share(r[0] / m.h), r: share(1 - c[1] / m.w), b: share(1 - r[1] / m.h) };
}

const out = {};
fs.readdirSync(IMG).filter((f) => /^\d{3}\.webp$/.test(f)).sort().forEach((f) => { out[+f.slice(0, 3)] = measure(path.join(IMG, f)); });
const pages = Object.keys(out).map(Number);
fs.writeFileSync(OUT, '/* page-trim.js - each page image\'s edges (tools/page-trim.js): shares of the image outside the paper, for doc.trim. */\n' +
  'window.SWPageTrim = {\n' + pages.map((p) => '  ' + p + ': ' + JSON.stringify(out[p]).replace(/"/g, '')).join(',\n') + '\n};\n');
const stat = (k, odd) => median(pages.filter((p) => (p % 2 === 1) === odd).map((p) => out[p][k]));
['l', 't', 'r', 'b'].forEach((k) => console.log(k, 'median odd', stat(k, true), 'even', stat(k, false)));
const odd = pages.filter((p) => ['l', 't', 'r', 'b'].some((k) => Math.abs(out[p][k] - stat(k, p % 2 === 1)) > 0.03));
console.log(pages.length + ' pages; ' + odd.length + ' differ by more than 3%: ' + odd.join(', '));
