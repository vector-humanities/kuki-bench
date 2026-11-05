/*
 * versions.js - the texts this bench holds: the translation and the literal translation, and the
 * source as OCR. Their files are listed here, in reading order, at the commit the bench holds them
 * (a snapshot of the translation's repository, in text/, glossary.csv, checks/ and source/).
 * roles: 'program' (the text itself), 'doc' (shown in Read, never compared).
 *
 * Kuki Shūzō, 偶然性の問題 (1935), in the vector translation of October–November 2026, copied from the
 * translation's working repository by tools/refresh.js (translation/SOURCE.json names the commit).
 */
(function (root) {
  'use strict';

  var SRC = '';   // the files are beside the page, under translation/

  // the list's machinery (links, descent, loading) is bench-kit's kit/versionlist.js
  var L = root.SWVersionList || require('../kit/versionlist.js'), files = L.files;

  var VERSIONS = [
    { id: 'literal', label: 'Literal translation', date: '2026', sort: 20260001, authors: 'D. M. Berry (vector translation)',
      fork: 'translation', status: 'recovered', medium: 'Markdown',
      summary: 'The literal version: Kuki’s sentences one by one, the glossary’s terms, translator’s notes inline in 〔Tr.: 〕. Preliminary; published with the translation as part of the apparatus.',
      build: files('translation/', ['Kuki_Problem-of-Contingency_literal.md']) },
    { id: 'translation', label: 'Translation', date: '2026', sort: 20260002, authors: 'D. M. Berry (vector translation)',
      fork: 'translation', status: 'recovered', medium: 'Markdown',
      summary: 'The translation, made from the literal and revised by the terminology pass and the read-through; translator’s notes as footnotes beginning “Tr.”, insertions in 〔 〕. Preliminary.',
      build: files('translation/', ['Kuki_Problem-of-Contingency_translation.md']) },
    { id: 'ocr', label: 'The source (NDL OCR)', date: '1948', sort: 19480001, authors: 'Kuki Shūzō',
      fork: 'source', status: 'recovered', medium: 'OCR of the page images',
      summary: 'The 1948 printing as the National Diet Library’s OCR reads it, image by image: unreliable (偶然 is read as 借然, 邂逅 never), for search only. The page images are the source.',
      build: files('translation/source/', ['guzensei-ocr-raw.txt']) }
  ];

  var DIALECTS = { text: { label: 'Text (read, not run)', options: {} } };
  VERSIONS.forEach(function (v) { v.dialect = 'text'; v.buildNotes = []; });

  // descent: the translation is made from the literal, the literal from the source
  var PARENT = { literal: 'ocr', translation: 'literal' };
  var LINES = [{ id: 'main', label: 'Source, literal, translation', tip: 'translation' }];

  var api = L({ versions: VERSIONS, src: SRC, dialects: DIALECTS, lines: LINES, parent: PARENT, witness: {}, also: {}, influence: {} });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SWVersions = api;
})(this);
