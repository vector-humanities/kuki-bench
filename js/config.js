/* config.js - this bench's settings for bench-kit (kit/). Loaded after kit/base.js, before the rest of the kit and the bench's own scripts.
 * The kit's README lists every setting;
 * kit/docs/bench-types.md describes a translation bench. */
(function (root) {
  'use strict';
  var SW = root.SW;
  SW.BENCH = {
    name: 'Kuki',
    title: 'Kuki Research Bench',
    slug: 'kuki',
    store: 'kukibench.',
    base: 'https://vector-humanities.github.io/kuki-bench/',
    repo: 'https://github.com/vector-humanities/kuki-bench',
    lang: 'plain',                                         // the texts' reader for Collate and Genealogy (kit/lang-plain.js)
    textLang: 'ja',                                        // the source's language (the word breaker, search, the lang of source words)

    // the translation, as the vector translation method lays it out (kit/vt-reader.js): what differs
    // from the method's layout. Kuki's translation predates that layout: two master files, the glossary as a table
    translation: {
      versions: { translation: 'translation', literal: 'literal', ocr: 'ocr' },   // the ids in js/versions.js
      page: '\\[p\\. (\\d+)\\]',                           // the page marker
      image: '\\[コマ (\\d+)\\]',                          // the image marker (the library's image number), or null
      body: { from: '^## Author', until: '^#+ (Appendix|Glossary)' },   // Kuki's text: from his own preface; the translator's Preface and Note before it          // where the apparatus begins
      // Kuki's glossary is the table at the end of the translation (the literal keeps a copy)
      glossary: { path: 'translation/Kuki_Problem-of-Contingency_translation.md', kind: 'md', heading: 'Glossary' },
      // the change lists of the first run (translation/SOURCE.json lists the files copied)
      changes: ['terms-pass/changes-1.md', 'terms-pass/changes-2a.md', 'terms-pass/changes-2b.md',
                'readthrough/fixes-1.md', 'readthrough/fixes-2a.md', 'readthrough/fixes-2b.md', 'readthrough/fixes-2c.md',
                'readthrough/fixes-3a.md', 'readthrough/fixes-3b.md', 'readthrough/fixes-3c.md', 'readthrough/fixes-poems.md']
        .map(function (f) { return 'translation/working/' + f; }),
      ocr: { path: 'translation/source/guzensei-ocr-raw.txt', split: '^=== PAGE (\\d+)' },
      // each NDL image is a spread of the 1948 printing: an odd page is the left half of image
      // (p + 13) / 2, an even page the right half of image (p + 14) / 2
      side: function (page) { return page % 2 ? 'left' : 'right'; }
    },

    refs: { names: { literal: 'LT', translation: 'TR', ocr: 'SRC' }, prefix: 'KK-', dir: 'translation/' },   // [REF: TR, Kuki_Problem-of-Contingency_translation.md:93]
    forks: [['translation', 'The translation'], ['source', 'The source']],
    start: 'translation',
    comment: [],

    // Book: the pages, the source's image to the left of the translation; the literal one switch away (Compare)
    doc: {
      versions: ['translation', 'literal'],
      beside: [],
      besideMax: 2,
      imageSide: 'left',
      imagesFirst: true,                                   // the page's image once, beside the first text
      words: { page: 'page' },
      // a page's image from the bench's own copies (tools/page-images.js, tools/ndl-copies.js): the library's
      // image service answers 429 when asked for many, so nothing here depends on it
      image: function (pb) {
        var p = +pb.facs; if (!p) return null;
        var k = String(p).padStart(3, '0');
        return { src: 'img/pages/' + k + '.webp', large: 'img/pages/' + k + '-large.webp', sharp: 'img/pages/' + k + '-full.webp' };
      },
      imageCreditShort: '国立国会図書館 National Diet Library, JAPAN',
      imageCredit: '九鬼周造『偶然性の問題』岩波書店, 1948 printing. 国立国会図書館 National Diet Library, JAPAN, Digital Collections <a href="https://dl.ndl.go.jp/pid/1037966" target="_blank" rel="noopener">pid 1037966 ↗</a> (public domain). The bench holds its own copies of the 174 images; img/provenance.csv gives each one’s source.'
    },

    folder: true,                                          // File ▾ ▸ Open a folder…: a working copy, read in place of the published files
    // the Images tab (kit/images.js): the 174 page images, and Kuki's 22 figures in print and archival form, with
    // the English labels the book draws (figures/, made by tools/figures.js)
    images: { figures: { url: 'figures/figures.json', overlays: 'figures/overlays.json' }, credit: '国立国会図書館 National Diet Library, JAPAN',
      held: { thumb: 'img/spreads/{key3}.webp', full: 'img/full/{key3}.webp' },   // the bench's own copies: no request to the library
      labelsNote: 'The English labels are the ones the printed book sets over Kuki’s figures. Each term is translated once: a word Kuki writes one character at a time along a line has a single label, set along that line, so its characters have no label each; a word set vertically beside a figure has its label beside it, reading downwards. The key under the caption lists every term.' },
    library: true,                                         // the Library tab, from library/library.json
    // dictionaries in the source's language (kit/dictionary.js; kit/tools/dict-build.js jmdict … --lang ja)
    dictionaries: [],                                      // to come: e.g. [{ id: 'jmdict', name: 'JMdict', base: 'data/jmdict/', lang: 'ja', credit: 'JMdict, EDRDG, CC BY-SA 4.0' }]
    menusOff: ['topics', 'paratexts'],                     // EDIT: take 'topics' out once a model is made (kit/docs/topics-guide.md); 'paratexts' once the group has documents about the work

    about: {
      icon: '<img src="img/icon.svg" alt="" width="40" height="40">',
      author: 'David M. Berry', citeAuthor: 'Berry, D. M.',
      purpose: 'A bench for reading the vector translation of Kuki Shūzō’s 偶然性の問題 (<i>The Problem of Contingency</i>, 1935) beside its source: each page of the 1948 printing beside the translation, with the literal translation one switch away, the glossary as a concordance, the change lists of the translation and where each change is now, and a source word looked for in the library’s OCR.',
      inside: 'The translation and the literal translation (preliminary, October–November 2026), divided into lines and set as pages; the glossary; the change lists of the terminology pass and the read-through; the agents’ briefs and editor’s notes; Kuki’s 22 figures; the National Diet Library’s OCR of the 1948 printing, for search.',
      sources: 'Kuki Shūzō, 偶然性の問題, Iwanami Shoten, 1935; fourth printing 1948, National Diet Library Digital Collections pid 1037966 (public domain). The translation: CC BY 4.0. The text held is a copy of the translation’s working repository at the commit named in translation/SOURCE.json.',
      code: 'https://github.com/vector-humanities/kuki-bench',
      catalogue: { skip: [], held: 'held' }
    },
    theme: { label: 'Iki', note: 'grey, brown and blue on paper, the colours Kuki names in The Structure of Iki (the default)' },
    accent: { dark: '#c4aa7d', light: '#233764' },
    group: '',                                             // EDIT: the Hypothesis group's ID, once you have made one
    relation: 'Kuki, The Problem of Contingency, ',
    settings: {
      tour: 'A few stops through the pages, the glossary and the changes; about a minute.',
      groupPlaceholder: 'https://hypothes.is/groups/…',
      themeHint: 'The colours of the whole bench. The ◐ button in the top bar switches between your last light and dark themes.'
    },
    tag: 'vt:',
    tagsHint: 'e.g. term, rendering, revision',
    annoHelp: {
      manual: 'https://github.com/vector-humanities/vector-translation', manualName: 'the vector translation method',
      start: 'Contingency, it is said', search: 'contingency',
      refA: 'CD, TR, Kuki_Problem-of-Contingency_translation.md:93', refB: 'EF, LT, Kuki_Problem-of-Contingency_literal.md:83',
      noteA: 'On the rendering of 偶然…', noteB: 'The literal has chance…', quoteA: 'On the rendering of 偶然…',
      boxA: 'Translation, line 93', boxB: 'Literal translation, line 83',
      tryText: 'The source’s `偶然`', code: '`偶然`',
      caption: 'A link from an annotation on the translation to one on the literal'
    },
    compare: { comment: '', normalised: false, reading: 'Reading', modes: ['text'] },
    comparePrefix: 'Kuki: ',
    genealogy: { set: ['literal', 'translation'], line: 'main', lineNames: { main: 'Source, literal, translation' } },
    // the group's private collection, named Parallel texts here (a paratext, on a translation bench, is the
    // translator's preface and notes, which the bench shows in its public text)
    paratexts: { org: 'vector-humanities', repo: 'kuki_paratexts', cache: 'kuki-paratexts' },   // EDIT: a private repository for the group's copies
    examples: { date: 'e.g. 1966', archive: 'e.g. National Diet Library', versions: 'e.g. translation, literal', refs: 'e.g. [REF: TR, Kuki_Problem-of-Contingency_translation.md:93]', publisher: 'e.g. Iwanami Shoten', finding: 'F1' },
    stemma: { root: 'ocr', lostBetween: {}, skip: [], lostOnTrunk: false },
    edition: { built: function () { return ['Read as', 'Markdown, divided into lines']; }, layout: function (raw) { return String(raw); }, words: true, files: ['all files', 'Every file'] },
    refHelp: {
      example: '[REF: TR, Kuki_Problem-of-Contingency_translation.md:93]',
      about: '<p><b>TR</b> (the translation; <b>LT</b> the literal translation, <b>SRC</b> the OCR), then the file and the lines.</p>',
      form: 'Form: [REF: TR, <file>:<lines>], e.g. [REF: TR, Kuki_Problem-of-Contingency_translation.md:93].',
      versions: { title: 'The texts', all: true }
    },
    sitemap: true
  };
})(typeof window !== 'undefined' ? window : globalThis);
