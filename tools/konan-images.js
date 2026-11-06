#!/usr/bin/env node
/*
 * tools/konan-images.js - the set of images of Kuki's annotated copy for the Images tab: 35 reduced copies
 * from the translation's working repository, copied unchanged, with a small copy of each for the list, and
 * images/annotated-copy.json, which gives each image's page, what is on it, and its full-size file at Konan
 * University Library, fetched only when a viewer zooms in. No full-size image is held.
 *
 *   node tools/konan-images.js <working repository>
 *
 * Image numbers are Konan's, a different sequence from the NDL's of the 1948 printing. Uses cwebp; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const src = process.argv[2];
if (!src) { console.error('usage: node tools/konan-images.js <working repository>'); process.exit(1); }
const ROOT = path.join(__dirname, '..'), IN = path.join(src, 'source/konan-annotated-copy');
const index = JSON.parse(fs.readFileSync(path.join(src, '_tmp/konan/index.json'), 'utf8'));
const FULL = 'https://archive.konan-u.ac.jp';
// image, page, what is on it (the Kuki session's survey; its readings are provisional)
const SET = [
  [47, 37, 'pencil note, cutting'], [48, 37, 'pencil note, cutting'], [49, 37, 'cutting, front'], [50, 37, 'cutting, back'],
  [53, 40, 'note'], [57, 44, 'cutting on the spread'], [58, 44, 'cutting on the spread'], [59, 44, 'cutting, front'], [60, 44, 'cutting, back'],
  [88, 72, 'note'], [89, 73, 'note'],
  [115, 99, 'cuttings on the spread and lifted'], [116, 99, 'cuttings on the spread and lifted'], [117, 99, 'cuttings, front'], [118, 99, 'cuttings, back'], [119, 99, 'second cutting, front'], [120, 99, 'second cutting, back'],
  [169, 148, 'insertion in a printed sentence'], [171, 150, 'note'],
  [177, 156, 'cutting on the spread and note beneath'], [178, 156, 'cutting on the spread and note beneath'], [179, 156, 'cutting of 21 October 1936, front'], [180, 156, 'cutting of 21 October 1936, back'], [181, 156, 'cutting of 13 December 1938, front'], [182, 156, 'cutting of 13 December 1938, back'],
  [187, 161, 'note'], [188, 162, 'note'], [189, 163, 'note'], [209, 183, 'diagram'], [238, 212, 'note'], [286, 260, 'note'], [289, 263, 'faint pencil note'], [294, 268, 'note'], [316, 290, 'note'], [356, 330, 'note']
];
const record = (n) => 'https://archive.konan-u.ac.jp/il/meta_pub/G0000861konanu_' + (n <= 62 ? 'L00400' : n <= 210 ? 'L00401' : 'L00402');
fs.mkdirSync(path.join(ROOT, 'img/annotated/thumbs'), { recursive: true }); fs.mkdirSync(path.join(ROOT, 'images'), { recursive: true });
const pad = (n) => String(n).padStart(3, '0'), missing = [];
const look = (name) => { const e = Array.isArray(index) ? index.find((x) => x.file === name || x.name === name) : index[name]; return e && (typeof e === 'string' ? e : e.OriginalPath); };
const items = SET.map(([n, page, what]) => {
  const name = 'A2_' + pad(n) + '.jpg', f = path.join(IN, name), original = look(name);
  if (!fs.existsSync(f)) { missing.push(name); return null; }
  if (!original) missing.push(name + ' (no original path)');
  fs.copyFileSync(f, path.join(ROOT, 'img/annotated', name));
  execFileSync('cwebp', ['-quiet', '-q', '60', '-resize', '320', '0', f, '-o', path.join(ROOT, 'img/annotated/thumbs', 'A2_' + pad(n) + '.webp')], { stdio: 'ignore' });
  return { key: 'A2_' + pad(n), n, page, what, thumb: 'img/annotated/thumbs/A2_' + pad(n) + '.webp', file: 'img/annotated/' + name, zoom: original ? FULL + original : null, record: record(n) };
}).filter(Boolean);
if (missing.length) { console.error('missing: ' + missing.join(', ')); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'images/annotated-copy.json'), JSON.stringify({
  id: 'annotated', label: 'Annotated copy',
  intro: 'Pages of Kuki’s own copy, printed on one side and without a colophon, with his notes and insertions and loose newspaper cuttings: a selection of 35 of Konan University Library’s images, in reduced copies. Zooming in fetches the full-size image from the library.',
  credit: '九鬼周造文庫, 原資料 A02, 甲南大学図書館 Konan University Library, digitised 29 May 2024.',
  items
}, null, 1) + '\n');
// in img/provenance.csv's columns: image,file,width,height,source,fetched,credit
const size = (f) => { const t = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', f], { encoding: 'utf8' }); return [/pixelWidth: (\d+)/.exec(t)[1], /pixelHeight: (\d+)/.exec(t)[1]]; };
const csv = path.join(ROOT, 'img/provenance.csv'), kept = fs.readFileSync(csv, 'utf8').split('\n').filter((l) => l && !/^A2_/.test(l));
fs.writeFileSync(csv, kept.concat(items.map((x) => [x.key, x.file].concat(size(path.join(ROOT, x.file)), [x.zoom, '2026-11-06', '"Konan University Library, 九鬼周造文庫, 原資料 A02; reduced to 2000 pixels wide"']).join(','))).join('\n') + '\n');
console.log(items.length + ' images');
