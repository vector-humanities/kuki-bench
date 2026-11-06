#!/usr/bin/env node
/*
 * tools/figures.js - Kuki's figures for the bench's image bank (kit: SW.BENCH.figures): reads the
 * translation's figure list (FIGURES.md), its labels (overlays.json) and the readable text's
 * captions, copies the print and archival files, and writes figures/figures.json.
 *
 *   node tools/figures.js <translation folder> [--out <bench folder>]
 *
 * A figure has overlays when overlays.json gives it labels and the text does not mark it
 * {overlays="no"} (Figure 16); otherwise the caption's key is shown beside it.
 */
'use strict';
const fs = require('fs'), path = require('path');
const argv = process.argv.slice(2), src = argv[0], out = argv.includes('--out') ? argv[argv.indexOf('--out') + 1] : path.join(__dirname, '..');
if (!src) { console.error('usage: node tools/figures.js <translation folder> [--out <bench folder>]'); process.exit(1); }
const FIG = path.join(src, 'front-and-back-matter/figures');
const list = fs.readFileSync(path.join(FIG, 'FIGURES.md'), 'utf8').split('\n');
const overlays = JSON.parse(fs.readFileSync(path.join(FIG, 'overlays.json'), 'utf8'));
const text = fs.readFileSync(path.join(src, 'Kuki_Problem-of-Contingency_translation.md'), 'utf8').split('\n');

// each image line in the readable text, with its attributes and the caption line after it
const inText = {};
text.forEach((s, i) => {
  const m = /^!\[Figure (\d+)\]\(([^)]+)\)(\{[^}]*\})?/.exec(s);
  if (!m) return;
  let j = i + 1; while (j < text.length && !text[j].trim()) j++;
  const cap = /^\*\*Figure \d+\.\*\*/.test(text[j]) ? text[j] : '';
  const k = /\s(Key|Labels):\s/.exec(cap);
  inText[+m[1]] = { file: path.basename(m[2]), noOverlays: /overlays="no"/.test(m[3] || ''),
    caption: (k ? cap.slice(0, k.index) : cap).replace(/^\*\*Figure \d+\.\*\*\s*/, '').replace(/\[\^[^\]]+\]/g, '').trim(), key: k ? cap.slice(k.index + 1).replace(/\[\^[^\]]+\]/g, '').trim() : '' };
});

// a figure's own note on its labels (the Images tab's "About the labels"), the bench's, by figure number
const NOTES = {
  1: '因果性 (causality) and 目的性 (purposiveness) are written one character at a time along the two diagonals, 因…果…性 and 目…的…性, and their English runs along the same lines. 必然性 (necessity) and 偶然性 (contingency) are set vertically beside the square, their English beside them, reading downwards. The corner labels read right to left: 然必的果因 is 因果的必然, causal necessity.'
};

const items = [];
let cur = null;
list.forEach((s) => {
  let m;
  if ((m = /^### Figure (\d+)/.exec(s))) { cur = { n: +m[1] }; items.push(cur); return; }
  if (!cur) return;
  if ((m = /^- Page: p\. (\d+) \(コマ (\d+)[^)]*\); IIIF region used: ([\d,]+)/.exec(s))) { cur.page = +m[1]; cur.image = m[2]; cur.region = m[3]; }
  if ((m = /^- File: (fig-\d+-p\d+\.png)/.exec(s))) cur.file = m[1];
});

fs.mkdirSync(path.join(out, 'figures/raw'), { recursive: true });
const result = items.map((f) => {
  const t = inText[f.n] || {}, id = 'fig-' + String(f.n).padStart(2, '0'), raw = f.file.replace(/\.png$/, '.jpg');
  if (t.file && t.file !== f.file) throw new Error('Figure ' + f.n + ': FIGURES.md has ' + f.file + ', the text ' + t.file);
  for (const [a, b] of [[f.file, f.file], ['raw/' + raw, 'raw/' + raw]]) fs.copyFileSync(path.join(FIG, a), path.join(out, 'figures', b));
  const labelled = (overlays[f.file] || []).length > 0 && !t.noOverlays;
  return { id, n: f.n, file: 'figures/' + f.file, original: 'figures/raw/' + raw, page: f.page, image: f.image, region: f.region, overlays: labelled, caption: t.caption || undefined, key: t.key || undefined, labelsNote: NOTES[f.n] };
});
fs.writeFileSync(path.join(out, 'figures/figures.json'), JSON.stringify({ items: result }, null, 1) + '\n');
fs.copyFileSync(path.join(FIG, 'overlays.json'), path.join(out, 'figures/overlays.json'));
const off = result.filter((f) => !f.overlays).map((f) => f.n);
console.log(result.length + ' figures; with overlays ' + (result.length - off.length) + '; key beside the image: ' + off.join(', ') + '; missing caption: ' + result.filter((f) => !f.caption).map((f) => f.n).join(', '));
