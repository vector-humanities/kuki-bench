# Changelog: the research bench

Changes to the Kuki Research Bench. The bench keeps its own version numbers, raised by 0.0.1 with each change (the `?v=` on every script and stylesheet in `index.html`).

## 0.1.23 (2026-11-07)

- bench-kit 1.3.0: the Library's facets, by kind, decade, author, language and tag.

## 0.1.22 (2026-11-06)

- The Library's books have their covers; bench-kit 1.2.0.

## 0.1.21 (2026-11-06)

- **The Library**: the Collected Works, vol. 2 names its base text again, the annotated copy of the first edition, with its source: CiNii's note on the 2012 Bunko.

## 0.1.20 (2026-11-06)

- The annotated copy described from Konan University Library's record: printed on one side, without a colophon, its newspaper cuttings loose.

## 0.1.19 (2026-11-06)

- bench-kit 1.1.0: a linked film or talk plays in the Library's box.

## 0.1.18 (2026-11-06)

- bench-kit 1.0.0, released: the bench off its proposal branch.

## 0.1.17 (2026-11-06)

- **Edit**: Beside offers Image, Literal and Off; the image and the text stay side by side, stacked only at phone width.

## 0.1.16 (2026-11-06)

- The annotated copy's credit shortened.

## 0.1.15 (2026-11-06)

- **The annotated copy in Images**: 35 reduced images of Kuki's own copy, with his notes and loose cuttings, as a set of their own beside Pages and Figures; the full size comes from Konan University Library only on zooming.
- **The Library**: a citation with Copy in each box; a DOI is a link; Copy link says what the button does; Open where it is published for a record with no copy held.
- The old picker no longer flashes on a reload.

## 0.1.14 (2026-11-06)

- **Pages**: the images button is an eye, crossed when they are hidden, and the images show whenever a page opens.

## 0.1.13 (2026-11-06)

- **The colours, in a browser that saw the bench before Iki**: a browser may have kept the kit's Listing paper as its light theme, which ◐ went back to. It starts again on Iki, once; a theme chosen in Settings after that stays.

## 0.1.12 (2026-11-06)

- The Library's labels: Held and Linked.

## 0.1.11 (2026-11-06)

- **The Library** holds twelve more free-to-read texts as published, and shows covers: its 63 records of scholarship are now articles, chapters and books. The bench is on bench-kit 0.99.0, off its proposal branch.

## 0.1.10 (2026-11-06)

- **The Library holds open-access texts**: Peeters 2017, Oda 2020, Morisato 2016, Stevens 2022 and Porto da Silva 2020, each the PDF as published, with its licence as stated and a link to where it is published.

## 0.1.9 (2026-11-06)

- **A padlock on Edit**: Edit opens locked, on each load and each time the tab is opened, and the text cannot change until the padlock is clicked.
- The bench's name on one line, now the kit's own setting.
- **The Library**: the note on the Collected Works, vol. 2 no longer says it was set from the annotated copy, which is unconfirmed for this book.

## 0.1.8 (2026-11-06)

- **The page images cropped to the paper**, in Pages and Edit: the scanner's white and the binding's black trimmed, measured page by page (`tools/page-trim.js`, `js/page-trim.js`, `doc.trim`), the image files unchanged. In Edit the whole page fits the pane's height, and a click enlarges it.
- Edit goes to the page asked for, where its marker falls inside a long paragraph.
- **The Library**: the note on Kuki's annotated copy no longer says it has an errata list or that the Collected Works is based on it.

## 0.1.7 (2026-11-06)

- **Images and Library back**: both had lost their sections when Read's was taken out in 0.1.6; they now add theirs beside the bench's own views.
- **Edit scrolls through the whole text**: pages are added as the text nears an end of the box, and the image and the page list follow the page in view. A long page also scrolls inside its box.
- The bench's name on one line.

## 0.1.6 (2026-11-06)

- **Edit, in Read's place**: the page's image beside the text as the file has it, the other version one switch away, with undo and redo kept across reloads. A save writes a change list for `vt_apply` into the working copy's `working/edits/`, or downloads it where there is no folder or the browser cannot write to one. Pages is now the first view. Links to lines open Edit.
- **Figures**: the labels' gold darkened to #7a5c00; footnote markers taken out of the captions and keys (Figure 16 and three others).

## 0.1.5 (2026-11-06)

- **The Images tab**: closing a figure no longer saves a file; its labels are in kintsugi gold, exported in gold or black; the tab opens on Figures and reads the bench's own copies of the page images, not the library's service. The version picker is off. Kit at `proposal/kuki-now` (d2b097d), ahead of its release.

## 0.1.4 (2026-11-06)

- **Page images held in the bench**: all 174 of the National Diet Library's images, at full resolution, with quick copies of each page, since the library's image service answers 429 when asked for many. **Colours**: Iki, the default and light, after Kuki's own colours of iki in 「いき」の構造; Kon, its dark counterpart.

## 0.1.3 (2026-11-06)

- **The Library**: Scaligero's review of Omodaka's French translation corrected from the JSTOR record (English, pp. 340–341); Mayeda's thesis dated from its copyright page.

## 0.1.2 (2026-11-05)

- **The Library**: 84 records of the book's editions and translations and the scholarship on it, each checked against the catalogue, publisher or repository it names, with a link to where it is published; eight from the reference manager.

## 0.1.1 (2026-11-05)

- **First release, on bench-kit 0.98.0**, made from the kit's translation template: the vector translation of 偶然性の問題 beside the 1948 printing. Pages (the National Diet Library's page image beside the translation, the literal one switch away), Images (the 174 page images and Kuki's 22 figures, print and archival, with the English labels the book sets), Glossary, Changes, Search and Library. The text is a copy of the translation's working repository at the commit named in `translation/SOURCE.json`.
