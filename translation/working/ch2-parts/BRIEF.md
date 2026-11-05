# Brief: Kuki, 偶然性の問題, Chapter 2 translation (shared by all parts)

## Source
- Page images: source/guzensei-pages/page_NNN.jpg (NNN = コマ number, zero-padded to 3 digits). Each image is a two-page spread of vertical Japanese (tategaki), pre-war orthography. Read the RIGHT page first (even page number), then the LEFT page (odd page number). Within a page, columns run right to left, top to bottom.
- Page mapping: odd page p is the left page of コマ (p+13)/2; even page p is the right page of コマ (p+14)/2.
- If a passage is hard to read, crop and enlarge it with sips into your own scratch folder (e.g. `sips -c H W --cropOffset Y X in.jpg --out crop.jpg; sips -Z 800 crop.jpg --out crop2.jpg`), then Read the crop.
- Do NOT use the OCR file; it is unreliable.

## Model for register and glossary
Read Kuki_Problem-of-Contingency_translation.md first: the header, the glossary table, and Chapter 1 in full. Chapter 1 is the model for register. Match it.

## Register (requested by the author of the project)
- Readable, interpretive English that someone can read as a piece of critical philosophy. Join Kuki's short declaratives into longer sentences that build through accretion, using "that is", "this is to say", "in other words", "consequently", "in this sense", "we might note". Alternate with short sentences at pivot points.
- Where Kuki names a thinker or a tradition a Western reader may not know, add a brief gloss inside the sentence (e.g. "Cournot, the nineteenth-century French mathematician and philosopher of chance,"). Keep glosses short and factual; do not add arguments Kuki does not make.
- Keep Kuki's own first person ("I think", "we") as the voice; never write "Kuki says" inside his text.
- British spelling (whilst, towards, labour, colour, realise, organise).
- Kuki's citations stay in his form inside the sentence. Quotations from European, Chinese or other authors are translated from Kuki's Japanese (not from the originals).
- Kuki's emphasis dots (圏点) → italics. Kuki's 甲乙丙 → A, B, C.
- Page markers: insert `[p. N]` exactly where page N begins (even mid-sentence), and `[コマ N]` beside the marker of the first page on each new spread, as in Chapter 1.
- Translator's notes only where English cannot carry something (wordplay, a term choice): `[*Tr.* ...]`.

## Banned (hard rules)
- No em dashes or en dashes anywhere. Use commas, colons or parentheses. Page ranges with a hyphen (pp. 12-15).
- No "not X but Y" / "not merely X but Y" / "X rather than Y" framing of your own (Kuki's own contrasts are fine to render, but phrase them flatly where you can).
- No aphoristic closers, chiasmus, "worse than" inversions, or sentences that restate the significance of the paragraph. End each paragraph on Kuki's last piece of content.
- Do not use: load-bearing, legible/legibility, honest/honesty, quietly, gestures towards, "the tension between", fundamental, "chosen, not found".
- Do not add commentary of your own about how important or striking a point is.

## Glossary additions for Chapter 2 (binding)
| Japanese | English |
|---|---|
| 理由的偶然 | contingency of ground |
| 消極的 / 積極的 | negative / positive |
| 因果的偶然 / 目的的偶然 | causal contingency / teleological contingency |
| 因果性 / 目的性 | causality / purposiveness |
| 目的 | purpose (end, where the sense is telos) |
| 手段 | means |
| 故意 | intention |
| 邂逅 | encounter (give 邂逅 in brackets at its first occurrence in your part) |
| 遭遇 | encounter |
| 二元 | two elements (e.g. 獨立なる二元の邂逅, "the encounter of two independent elements"; give the Japanese at first occurrence) |
| 系列 | series |
| 獨立 | independent / independence |
| 複合的偶然 | compound contingency |
| 同時的 / 繼起的 | simultaneous / successive |
| 驚異 / 驚き | wonder |
| 周易 | the *Book of Changes* (*Zhouyi*) |
| 運命 | fate |
| アウトマトン / テュケ | *automaton* / *tychē* (keep Greek where Kuki gives it) |

Chapter 2 section titles (use exactly; heading format `### N. Title`):
1 Contingency of Ground; 2 Negative Contingency of Ground; 3 Positive Contingency of Ground; 4 Causality and Purposiveness; 5 Causal Contingency and Teleological Contingency; 6 Negative Teleological Contingency; 7 Positive Teleological Contingency; 8 Purpose without Purpose; 9 Intention and Chance; 10 Automaton and Tychē; 11 From Teleological Contingency to Causal Contingency; 12 Negative Causal Contingency; 13 Positive Causal Contingency; 14 Compound Contingency; 15 The General Character of Positive Hypothetical Contingency; 16 The Book of Changes and Chance; 17 Simultaneous Contingency and Successive Contingency; 18 Contingency and Spatio-temporal Determination; 19 History and Chance; 20 The Objectivity of Contingency; 21 From Hypothetical Contingency to Disjunctive Contingency.

## Output
- Write to the part file you are given. Write each section to the file as soon as it is finished (append), so nothing is lost if you are interrupted.
- At the end of the part file add `#### Notes for the editor` listing: any readings you were unsure of (page, Japanese, your reading), any new terms you had to fix that are not in the glossary, and any page where text was illegible.
- Do not edit any other file.

## Literal version (also required)
Produce TWO files for your range, working section by section (literal first, then readable, for each section):
1. **Literal crib** (`partX-literal.md`): a close, sentence-by-sentence translation for checking quotations against the Japanese. Keep Kuki's sentence boundaries and order; no glosses, no joining of sentences, no added names or explanations. Same glossary, same page and コマ markers, same headings. British spelling and the dash ban still apply. The model is the Introduction in Kuki_Problem-of-Contingency_literal.md.
2. **Readable version** (`partX-readable.md`): as described above.
The readable version must not contain any claim, citation or quotation that is absent from the literal version, other than the short identifying glosses.

## CHANGE (supersedes the gloss instructions above): glosses go in footnotes
In the readable version, do NOT write identifying glosses into the sentence. Put them in Markdown footnotes instead, and put every translator's note there too (no inline `[*Tr.* ...]` in the readable version).
- Footnote labels: `[^c2sN-k]`, where N is the section number and k counts from 1 within the section (e.g. `[^c2s12-3]`). Place the marker after the word or punctuation it glosses.
- Put the footnote definitions at the end of each section, after its last paragraph: `[^c2s12-3]: Tr. Cournot (1801-1877), French mathematician and economist, ...`. Every footnote begins "Tr." (Kuki's own references are inline; all footnotes are the translator's.)
- Keep footnotes short and factual: who someone is, what a Greek, Latin or Chinese term means, a term choice that English cannot show. No arguments.
- The sentence flow, reformulations ("that is", "this is to say") and British spelling stay as before. The readable text itself should now contain only what Kuki says, rendered readably.
- The literal version is unchanged (inline `[*Tr.* ...]` notes are fine there).
- If you have already written sections with inline glosses, convert them to footnotes before you finish.
