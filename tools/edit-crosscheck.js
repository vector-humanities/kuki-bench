// Edit's change lists against the real vt_apply.py, on a scratch copy of Kuki's translation.
// node crosscheck.js <kit> <text file> <vt_apply.py> <work dir>
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [kit, file, tool, work] = process.argv.slice(2);
const VT = require(path.join(kit, 'vt-reader.js')); globalThis.SWVT = VT;
const E = require(path.join(kit, 'vt-edit.js'));
const DESC = { page: '\\[p\\. (\\d+)\\]', image: '\\[コマ (\\d+)\\]', body: { from: '^## Author', until: '^#+ (Appendix|Glossary)' } };
const base = fs.readFileSync(file, 'utf8');
let seed = 12345; const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };

// an edit: one word changed, deleted or inserted; a phrase repeated elsewhere changed; a marker moved;
// a paragraph split, joined or removed; a line added at the end or the start
function mutate(s) {
  const k = rnd(11), at = rnd(s.length - 2000) + 500;
  const word = /[\p{L}]{4,}/gu; word.lastIndex = at; const m = word.exec(s);
  if (!m) return s;
  const a = m.index, b = a + m[0].length;
  switch (k) {
    case 0: return s.slice(0, a) + 'REPLACED' + s.slice(b);
    case 1: return s.slice(0, a) + s.slice(b + 1);
    case 2: return s.slice(0, a) + 'inserted ' + s.slice(a);
    case 3: { const c = s.indexOf(' contingency ', at); return c < 0 ? s : s.slice(0, c) + ' contingent thing ' + s.slice(c + 13); }
    case 4: return s.slice(0, a) + '\n\n' + s.slice(a);                                  // a paragraph split
    case 5: { const c = s.indexOf('\n\n', at); return c < 0 ? s : s.slice(0, c) + ' ' + s.slice(c + 2); }   // two joined
    case 6: { const c = s.indexOf('\n\n', at), d = s.indexOf('\n\n', c + 2); return d < 0 ? s : s.slice(0, c) + s.slice(d); }   // a paragraph gone
    case 7: return s + 'A line at the end.\n';
    case 8: return 'A line at the top.\n' + s;
    case 9: return s.slice(0, a) + m[0] + m[0] + s.slice(b);                              // a word doubled: OLD inside NEW
    case 10: { const c = s.indexOf('[p. ', at); if (c < 0) return s; const e = s.indexOf(']', c) + 1; const mk = s.slice(c, e); return s.slice(0, c) + s.slice(e + 1) .replace(/^(\S+ \S+ )/, '$1' + mk + ' '); }
  }
  return s;
}

fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work, { recursive: true });
const copy = path.join(work, 'text.md');
let runs = 0, entries = 0, fail = 0;
for (let run = 0; run < 400; run++) {
  fs.writeFileSync(copy, base);
  let text = base; const n = 1 + rnd(6);
  for (let i = 0; i < n; i++) text = mutate(text);
  let es;
  try { es = E.entries(base, text, { target: 'translation', desc: DESC }); } catch (e) { console.log('run', run, 'THROW', e.message); fail++; continue; }
  const raw = E.list(es, { title: 'Run ' + run, origin: 'editor DB', why: 'a test' });
  const list = path.join(work, 'edit-' + String(run).padStart(3, '0') + '.md');
  fs.writeFileSync(list, raw);
  const r = cp.spawnSync('python3', [tool, list, '--target', 'translation=' + copy, '--write'], { encoding: 'utf8' });
  const out = fs.readFileSync(copy, 'utf8');
  entries += es.length; runs++;
  if (r.status !== 0 || out !== text) { fail++; console.log('run', run, 'vt_apply', r.status, out === text ? 'text same' : 'TEXT DIFFERS', (r.stdout || '').split('\n').filter((l) => /REFUSED/.test(l)).slice(0, 3).join(' / ')); continue; }
  // the view's own reading: before vt_apply the list gives the text, after it nothing is left to apply
  const w1 = E.working(base, [{ name: 'l', raw }], 'translation'), w2 = E.working(text, [{ name: 'l', raw }], 'translation');
  if (w1.text !== text || w1.stuck.length) { fail++; console.log('run', run, 'working before: differs, stuck', w1.stuck.length); }
  if (w2.text !== text || w2.stuck.length || w2.pending.length) { fail++; console.log('run', run, 'working after: pending', w2.pending.length, 'stuck', w2.stuck.length); }
  fs.readdirSync(work).filter((f) => /\.bak$/.test(f)).forEach((f) => fs.unlinkSync(path.join(work, f)));
}
// undo and redo: every step back and forward gives the text as it was
const H = E.history(base.slice(0, 5000)); const seen = [H.text]; let t = H.text;
for (let i = 0; i < 300; i++) { const a = rnd(t.length), nx = t.slice(0, a) + (i % 3 ? 'x' : '') + t.slice(a + (i % 3 === 1 ? 2 : 0)); if (nx === t) continue; H.change(Object.assign(E.diffOp(t, nx), { brk: true })); t = H.text; seen.push(t); }
let bad = 0; for (let i = seen.length - 2; i >= 0; i--) { H.undo(); if (H.text !== seen[i]) bad++; } for (let i = 1; i < seen.length; i++) { H.redo(); if (H.text !== seen[i]) bad++; }
console.log(`${runs} runs, ${entries} entries through vt_apply; ${fail} failures; undo/redo mismatches ${bad}`);
const sample = E.entries(base, base.replace('Contingency is the negation of necessity.', 'Contingency is the denial of necessity.'), { target: 'translation', desc: DESC });
console.log(E.list(sample, { title: 'Sample', origin: 'editor DB', why: 'a test' }));
process.exit(fail || bad ? 1 : 0);
