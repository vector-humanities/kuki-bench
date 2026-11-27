#!/usr/bin/env node
/* tools/konan-chronology.js - Konan University's chronology of Kuki (「九鬼周造年譜」, three scanned pages, reprinted
 * from the chronology in 『をりにふれて』 by courtesy of 澤瀉久敬) as a set in the Images tab: a reduced copy of each
 * page, 1400 pixels wide, a small copy for the list, and images/konan-chronology.json. The full scan stays with
 * Konan University's repository (record 3025), linked from each page; its file address expires within a minute,
 * so nothing is fetched from it.
 *
 *   node tools/konan-chronology.js <the PDF from https://konan-u.repo.nii.ac.jp/records/3025>
 *
 * Uses pdftoppm (poppler) and cwebp; no packages.
 */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..'), pdf = process.argv[2];
if (!pdf || !fs.existsSync(pdf)) { console.error('usage: node tools/konan-chronology.js <Konan T00004.pdf>'); process.exit(1); }
const bin = (n) => ['/opt/homebrew/bin/', '/usr/local/bin/', '/usr/bin/'].map((d) => d + n).find((p) => fs.existsSync(p)) || n;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nenpu-'));
cp.execFileSync(bin('pdftoppm'), ['-png', '-scale-to-x', '1400', '-scale-to-y', '-1', pdf, path.join(tmp, 'p')]);
const dir = path.join(ROOT, 'img/chronology');
fs.mkdirSync(path.join(dir, 'thumbs'), { recursive: true });
const RECORD = 'https://konan-u.repo.nii.ac.jp/records/3025';
// what each page covers (read from the scan)
const WHAT = ['1888–1935: birth to the chair at Kyoto', '1935–1941: The Problem of Contingency to his death and burial at Hōnen-in', '1942–1976: posthumous books; notes on the doctorate and the gravestone'];
const items = fs.readdirSync(tmp).filter((f) => /\.png$/.test(f)).sort().map((f, i) => {
  const n = i + 1, key = 'nenpu-' + n;
  cp.execFileSync(bin('cwebp'), ['-quiet', '-q', '72', path.join(tmp, f), '-o', path.join(dir, key + '.webp')]);
  cp.execFileSync(bin('cwebp'), ['-quiet', '-q', '60', '-resize', '240', '0', path.join(tmp, f), '-o', path.join(dir, 'thumbs', key + '.webp')]);
  return { key, n, what: WHAT[i] || '', thumb: 'img/chronology/thumbs/' + key + '.webp', file: 'img/chronology/' + key + '.webp', record: RECORD };
});
fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(path.join(ROOT, 'images/konan-chronology.json'), JSON.stringify({
  id: 'chronology',
  label: 'Chronology',
  intro: '九鬼周造年譜, a chronology of Kuki’s life and publications from 1888 to 1976, in three pages reprinted by Konan University, which holds Kuki’s library. It gives the doctorate of 1932 as awarded for 「偶然性」, a mimeographed paper of 66 pages, and records that the gravestone at Hōnen-in carries Goethe’s poem in Nishida Kitarō’s translation and hand. Reduced copies; the scan in full is in Konan University’s repository.',
  credit: '「九鬼周造年譜」, 甲南大学 Konan University, from the chronology in 『をりにふれて』, by courtesy of 澤瀉久敬 Omodaka Hisayuki.',
  items
}, null, 1) + '\n');
console.log(items.length + ' pages: img/chronology/, images/konan-chronology.json');
