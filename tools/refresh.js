#!/usr/bin/env node
/*
 * tools/refresh.js - the bench's copy of the Kuki translation, taken from the translation's working
 * repository at its current commit: a fixed list of files, copied under translation/ at their own
 * paths (so that File ▾ ▸ Open a folder… on the working repository finds each one), the commit
 * written to translation/SOURCE.json, and every copied file scanned for what must not be published.
 *
 *   node tools/refresh.js <working repository>            copy, scan, write SOURCE.json
 *   node tools/refresh.js <working repository> --check    compare the bench's copies, byte for byte,
 *                                                          with the files at the commit SOURCE.json names
 *
 * The working repository is the master: corrections go there, never into these copies. The copy
 * refuses files with uncommitted changes, so the commit recorded is the text copied.
 */
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const argv = process.argv.slice(2), src = argv[0], CHECK = argv.includes('--check');
const BENCH = path.join(__dirname, '..'), OUT = path.join(BENCH, 'translation');
if (!src) { console.error('usage: node tools/refresh.js <working repository> [--check]'); process.exit(1); }
const git = (...a) => execFileSync('git', ['-C', src, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });

// What is published, as the translator decided (2026-11-05): the two versions, the source's OCR, the
// agents' briefs, the change lists and the editor's notes. Backups, the French check, the Preface's
// fact sheet, references/ and the private log are not.
const FIXED = [
  'Kuki_Problem-of-Contingency_literal.md',
  'Kuki_Problem-of-Contingency_translation.md',
  'source/guzensei-ocr-raw.txt',
  'working/ch2-parts/BRIEF.md', 'working/ch3-parts/BRIEF.md', 'working/readthrough/BRIEF.md', 'working/terms-pass/BRIEF.md',
  'working/ch2-parts/ch2-editor-notes.md', 'working/ch3-parts/ch3-editor-notes.md',
  'book/Kuki_Problem-of-Contingency.pdf'   // the typeset book, linked from About and the README
];
const LISTS = [['working/terms-pass', /^changes-.*\.md$/], ['working/readthrough', /^fixes-.*\.md$/]];
const NEVER = [/^references\//, /\.bak\.md$/, /french-check/, /preface-facts/, /^corpus\/texts\//];

function fileList() {
  const out = FIXED.slice();
  LISTS.forEach(([dir, re]) => fs.readdirSync(path.join(src, dir)).filter((f) => re.test(f)).sort().forEach((f) => out.push(dir + '/' + f)));
  out.forEach((f) => { if (NEVER.some((re) => re.test(f))) throw new Error('refused: ' + f); });
  return out;
}

// what must not be in a public file: addresses, local paths and token-like strings here; the names of
// private repositories, of the series and of private material in a deny list kept outside the
// repository (~/.config/vt-scan/deny.txt, or the file VT_DENY names: a pattern, a tab, what it is)
const SCAN = [
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/, 'an email address'],
  [/\/Users\/|\/home\/|C:\\/, 'a local path'],
  [/\b(ghp|github_pat|sk|hf)_[A-Za-z0-9_]{16,}/, 'a token']
];
const DENY = process.env.VT_DENY || path.join(require('os').homedir(), '.config/vt-scan/deny.txt');
if (!fs.existsSync(DENY)) { console.error('no deny list at ' + DENY + ': the scan needs it'); process.exit(1); }
fs.readFileSync(DENY, 'utf8').split('\n').filter((l) => l.trim() && !/^#/.test(l)).forEach((l) => {
  const [re, what] = l.split('\t'); SCAN.push([new RegExp(re), what || 'a private name']);
});
// what a file may name by the translator's decision: the series in the typeset book's imprint (approved 27 November 2026)
const ALLOW = { 'book/Kuki_Problem-of-Contingency.pdf': ['the series'] };
function scan(rel, text) {
  const hits = [], ok = ALLOW[rel] || [];
  text.split('\n').forEach((s, i) => SCAN.forEach(([re, what]) => { if (ok.indexOf(what) < 0 && re.test(s)) hits.push(rel + ':' + (i + 1) + ': ' + what + ': ' + s.trim().slice(0, 100)); }));
  return hits;
}

if (CHECK) {
  const meta = JSON.parse(fs.readFileSync(path.join(OUT, 'SOURCE.json'), 'utf8'));
  let bad = 0;
  meta.files.forEach((f) => {
    const there = execFileSync('git', ['-C', src, 'show', meta.commit + ':' + f], { maxBuffer: 64 << 20 }), here = fs.readFileSync(path.join(OUT, f));
    if (!there.equals(here)) { bad++; console.log('differs: ' + f); }
  });
  console.log(bad ? bad + ' of ' + meta.files.length + ' files differ from ' + meta.commit : 'all ' + meta.files.length + ' files match ' + meta.commit);
  process.exit(bad ? 1 : 0);
}

const files = fileList();
const dirty = git('status', '--porcelain', '--', ...files).trim();
if (dirty) { console.error('uncommitted changes in the working repository; commit them first:\n' + dirty); process.exit(1); }
const commit = git('rev-parse', '--short', 'HEAD').trim(), date = git('log', '-1', '--format=%cs').trim();

let hits = [];
// a PDF is scanned through the text pdftotext takes from it (its streams are compressed, so its bytes would hide a name)
const PDFTEXT = ['/opt/homebrew/bin/pdftotext', '/usr/local/bin/pdftotext', '/usr/bin/pdftotext'].find((t) => fs.existsSync(t));
function readable(f) {
  if (!/\.pdf$/i.test(f)) return fs.readFileSync(path.join(src, f), 'utf8');
  if (!PDFTEXT) { console.error('cannot scan ' + f + ': pdftotext (poppler) is needed'); process.exit(1); }
  return execFileSync(PDFTEXT, ['-q', '-enc', 'UTF-8', path.join(src, f), '-'], { maxBuffer: 64 << 20 }).toString('utf8');
}
files.forEach((f) => { hits = hits.concat(scan(f, readable(f))); });
if (hits.length) { console.error('not copied: the scan found\n' + hits.join('\n')); process.exit(1); }

fs.rmSync(OUT, { recursive: true, force: true });
files.forEach((f) => { fs.mkdirSync(path.dirname(path.join(OUT, f)), { recursive: true }); fs.copyFileSync(path.join(src, f), path.join(OUT, f)); });
fs.writeFileSync(path.join(OUT, 'SOURCE.json'), JSON.stringify({
  note: 'The translation as of this commit of its working repository, which is the master. Corrections go there, as change lists, not into these copies.',
  commit, date, copied: new Date().toISOString().slice(0, 10), files
}, null, 1) + '\n');
console.log('copied ' + files.length + ' files at ' + commit + ' (' + date + '); scan clean');
