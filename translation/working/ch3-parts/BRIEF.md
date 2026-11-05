# Brief: Kuki, 偶然性の問題, Chapter 3 and Conclusion (shared by all parts)

## Source
- Page images: source/guzensei-pages/page_NNN.jpg (NNN = コマ number, 3 digits). Two-page spreads of vertical Japanese, pre-war orthography. Read the RIGHT page (even page number) first, then the LEFT (odd). Columns run right to left.
- Page mapping: odd page p is the left page of コマ (p+13)/2; even page p is the right page of コマ (p+14)/2.
- Crop and enlarge hard passages with sips into your own scratch folder (`sips -c H W --cropOffset Y X in.jpg --out crop.jpg; sips -Z 800 crop.jpg --out crop2.jpg`), then Read the crop. Do NOT use the OCR file.

## BOUNDARIES: headings, not page numbers
The contents page is unreliable, and section headings fall partway down pages. Your range is defined by HEADINGS: start exactly at your first heading and stop exactly at the next part's first heading, wherever on the page each falls. The コマ range you are given is approximate; look a spread or two either side to find the headings. Text above your first heading belongs to the previous part; text after your last section up to the next part's heading is yours, even if it runs onto a later page.

## Models
Read first, in :
- Kuki_Problem-of-Contingency_translation.md: the header, the full glossary table (binding), Chapter 1, and Chapter 2 §5 and §15. This is the model for the readable version.
- Kuki_Problem-of-Contingency_literal.md: the Introduction and Chapter 1. This is the model for the literal version.

## Produce TWO files, section by section (literal first, then readable, for each section)
1. Literal crib (`partX-literal.md`): close, sentence by sentence, for checking quotations. Keep Kuki's sentence boundaries; no glosses, no joining, no added names. Inline `[*Tr.* ...]` notes allowed.
2. Readable version (`partX-readable.md`): readable, interpretive English that can be read as critical philosophy. Join Kuki's short declaratives into longer sentences that build through accretion ("that is", "this is to say", "in other words", "consequently", "in this sense", "we might note"), with shorter sentences at pivots. Keep Kuki's first person ("I think", "we"). British spelling. The readable text must contain only what Kuki says; it must not contain any claim, citation or quotation absent from the literal version.
   - ALL glosses (who someone is, what a Greek, Latin, Sanskrit or Chinese term means, term choices English cannot show) and all translator's notes go in Markdown footnotes, never in the sentence and never as inline `[*Tr.*]`. Labels: `[^c3sN-k]` for Chapter 3 section N (e.g. `[^c3s8-4]`); `[^concN-k]` for Conclusion section N. Definitions at the end of each section, each beginning "Tr.". Keep them short and factual. Only give attributions or dates you are confident of; if unsure, leave it out and list it in your notes.

## Both versions
- Kuki's citations stay in his form, inline. Quotations of other authors are translated from Kuki's Japanese.
- Emphasis dots (圏点) → italics. 甲乙丙 → A, B, C.
- Page markers `[p. N]` exactly where page N begins (even mid-sentence); `[コマ N]` beside the first page marker on each new spread. If your first heading is mid-page, do not repeat that page's marker.
- Headings: `### N. Title` using the titles below. The part that contains 第三章 opens with `## Chapter 3. Disjunctive Contingency (第三章 離接的偶然) [コマ 99-165]`; the part that contains 結論 opens it with `## Conclusion (結論) [コマ 166-174]` and uses `### N. Title` for its two sections. (Correct the コマ ranges in those chapter headings if the headings are elsewhere.)

## Banned (hard rules, both versions)
- No em dashes or en dashes anywhere. Commas, colons or parentheses instead; hyphens in page ranges (pp. 12-15).
- No "not X but Y" / "not merely X but Y" / "X rather than Y" framing of your own.
- No aphoristic closers, chiasmus, "worse than" inversions, or sentences that restate a paragraph's significance. End each paragraph on Kuki's last piece of content.
- Never use: load-bearing, legible/legibility, honest/honesty, quietly, gestures towards, "the tension between", fundamental (except in a title), "chosen, not found".
- No commentary of your own on how important or striking something is.

## Glossary additions for Chapter 3 and the Conclusion (binding, with the glossary in the translation file)
| Japanese | English |
|---|---|
| 離接的偶然 | disjunctive contingency |
| 樣相性 | modality |
| 可能性 / 不可能性 / 現實性 / 必然性 | possibility / impossibility / actuality / necessity |
| 體系 | system |
| 類似關係 / 近接關係 | relation of similarity / relation of proximity |
| 蓋然性 | probability |
| 遊戲 | play |
| 驚異 / 驚き | wonder |
| 情緒 | emotion |
| 運命 | fate |
| 形而上的絕對者 | the metaphysical absolute |
| 原始偶然 | primal contingency (*Urzufall*) |
| 有 / 無 | being / nothing |
| 內面化 | internalisation |
| 邂逅 / 遭遇 | encounter (give the Japanese where Kuki pairs them) |
| 獨立なる二元の邂逅 | the encounter of two independent elements |
| 離接肢 | disjunct |
| 理由律 / 充足理由律 | law of ground / law of sufficient reason |
| 無目的 / 反目的 | purposelessness / counter-purpose |

Section titles (use exactly):
Chapter 3: 1 The Meaning of Disjunctive Contingency; 2 Modality in General; 3 Two Systems of Modality; 4 The Relation of Similarity between Contingency and Possibility; 5 The Relation of Proximity between Contingency and Impossibility; 6 The Third System of Modality; 7 Summary of the Three Systems; 8 The Play of Chance and the Concept of Probability; 9 The Temporal Character of Contingency; 10 Contingency and the Emotion of Wonder; 11 Chance and Art; 12 Chance and Fate; 13 The Metaphysical Absolute; 14 Being and Nothing.
Conclusion: 1 The Core Meaning of Contingency; 2 The Internalisation of Contingency.

## Output
- Write to your two part files in ch3-parts/. Append each section as soon as it is finished.
- End each file with `#### Notes for the editor`: exact page and position of your first and last headings; uncertain readings (page, Japanese, your reading); printed figures or references that look wrong (keep them as printed); new terms you fixed; unverified attributions; illegible text.
- Before finishing, check: every readable footnote marker has exactly one definition; no dashes; no banned words.
- Do not edit any other file.

## CHANGE (2026-10-20, binding, supersedes the glossary): existence, being, nothingness
Kuki uses two distinct pairs, and the translation must keep them apart in BOTH versions:
| Japanese | English |
|---|---|
| 存在 | existence (存在する: exist; 存在者: the existent) |
| 非存在 | non-existence |
| 有 | being |
| 無 | nothingness (無い / 無し in ordinary negation: "there is no", "without") |
| 有と無 | being and nothingness |
| 眞の存在 | true existence |
| 極限的存在 | limit-existence |
| 存在論 / 存在論的 | ontology / ontological (unchanged) |
Section 14's title becomes "Being and Nothingness". Where Kuki pairs 存在 and 有 in one sentence, the distinction must be visible. If you have already written text using "being" for 存在 or "nothing" for 無, correct it against the images before you finish.
- 虛無性 = nihility (to keep it apart from 無 = nothingness); 虛無的 = nihilistic in the modal sense, footnoted at first use. 實在性 = reality (unchanged).
