# Kuki Research Bench

**Version:** 0.1.35 (bench-kit 1.8.1)  
**Live:** https://vector-humanities.github.io/kuki-bench/ (once published)

A research bench for reading the vector translation of Kuki Shūzō's 偶然性の問題 (*The Problem of Contingency*, Iwanami Shoten, 1935) beside its source. It is built on [bench-kit](https://github.com/critical-code-studies/bench-kit), from its translation template, and reads a translation made by the [vector translation method](https://github.com/vector-humanities/vector-translation).

The translation is preliminary (October–November 2026): the whole text is translated, in a literal translation and the translation, and the translation read against the literal; it has not yet been checked against the *Collected Works* or Omodaka's French translation (1966).

## What is here

- **Pages**: each page of the 1948 printing, from the bench's own copies of the National Diet Library's images, beside the translation; Compare sets the literal translation beside them, the texts held at the same page as either is scrolled. A click on the image opens it larger, to zoom.
- **Read**: each version line by line, with a search, annotations shared through a Hypothesis group, citations and export.
- **Glossary**: each Japanese term, its renderings, and where each rendering falls in the translation, section by section; ⚠ marks an English word that renders more than one Japanese term (ground: 根據 and 理由; encounter: 邂逅 and 遭遇).
- **Changes**: the change lists of the terminology pass and the read-through, each change at its page, with the Japanese where the list gives it, and whether it is in the text now.
- **Search**: a Japanese word in the library's OCR of the 1948 printing, old character forms read as new, each hit linked to its page. The OCR is unreliable (it reads 偶然 as 借然 and never reads 邂逅); the page images are the source.
- **Versions ▾**, **Findings**, **My notes**, **Library** and **Help**, as in every bench-kit bench.

## The texts

The translation is a copy, under `translation/`, of the translation's working repository at the commit named in `translation/SOURCE.json`. The working repository is the master: corrections are made there and the bench is refreshed from it with `tools/refresh.js`, which copies a fixed list of files, records the commit, and scans every file for what must not be published. `node tools/refresh.js <working repository> --check` compares the copies with the files at that commit, byte for byte.

| Path | What |
|---|---|
| `translation/Kuki_Problem-of-Contingency_literal.md` | the literal version |
| `translation/Kuki_Problem-of-Contingency_translation.md` | the translation, with the apparatus and the glossary |
| `translation/working/` | the agents' briefs, the change lists of the terminology pass and the read-through, the editor's notes |
| `translation/source/guzensei-ocr-raw.txt` | the National Diet Library's OCR, image by image (for search only) |
| `figures/` | Kuki's 22 figures: the print files, the archival crops (`raw/`), `figures.json`, and the English labels (`overlays.json`), made by `kit/tools/vt-figures.js` |
| `img/pages/`, `img/spreads/`, `img/full/` | the bench's own copies of the 174 page images: each page at 560 and 900 pixels wide and at full resolution, each spread as a thumbnail and at full resolution, made by `tools/page-images.js` and `tools/ndl-copies.js`; `img/provenance.csv` gives each one's source |
| `js/images.js` | the 174 images in the library's IIIF service (bench-kit's `tools/iiif-map.js`): their keys, labels and sizes |

Markers in the texts: `[p. N]` begins page N of the 1948 printing; `[コマ N]` is the library's image of that spread (an odd page is the left half of image (N + 13) / 2, an even page the right half of image (N + 14) / 2). Insertions into Kuki's text are in 〔 〕; the translation's footnotes are the translator's and begin "Tr."; the literal's notes are inline in 〔Tr.: 〕.

## Running it locally

```
git clone --recurse-submodules https://github.com/vector-humanities/kuki-bench
cd kuki-bench
python3 -m http.server 8000
```

and open `http://localhost:8000/`. File ▾ ▸ Open a folder… reads a working copy of the translation in place of the copy held here.

## Sources

九鬼周造『偶然性の問題』岩波書店, first printing 15 December 1935; fourth printing 20 April 1948, from National Diet Library Digital Collections, [pid 1037966](https://dl.ndl.go.jp/pid/1037966). Kuki died in 1941; the text is in the public domain. Page images and figures: 国立国会図書館 National Diet Library, JAPAN.

## Colours

The default theme, Iki, takes its colours from Kuki's 「いき」の構造 (*The Structure of Iki*, 1930), which finds the colours of iki in three lines: grey (鼠色), brown (黄柄茶, 媚茶) and blue (紺, 御納戸). Kon is its dark counterpart. The hex values approximate those traditional colours.

## Licence

The bench's code is GPL-3.0 (`LICENSE`); bench-kit is GPL-3.0. The translation (the translation and the literal translation, notes and apparatus) is © David M. Berry 2026, under the Creative Commons Attribution 4.0 International Licence (CC BY 4.0). Kuki's Japanese text and the page images are in the public domain.
