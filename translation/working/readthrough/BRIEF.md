# Brief: read-through, readable against literal

Kuki Shūzō, 偶然性の問題 (1935; 1948 printing). Two English versions in :
- Kuki_Problem-of-Contingency_literal.md: close, sentence by sentence. This is the reference.
- Kuki_Problem-of-Contingency_translation.md: readable, interpretive prose. Its header, Translator's Note and glossary set the conventions: all footnotes are the translator's and begin "Tr."; any insertion into Kuki's text is in 〔 〕; quotations of other authors are from Kuki's Japanese; existence = 存在, being = 有, nothingness = 無.
Page images, for disputes: guzensei-pages/page_NNN.jpg (odd page p = left page of コマ (p+13)/2; even page p = right page of コマ (p+14)/2; vertical text, right page first).

## Task
For your range, go paragraph by paragraph, using the `[p. N]` markers to align the two versions. Find places where the READABLE version:
1. ADDS: a claim, example, name, date, qualification, contrast or interpretation absent from the literal (glosses that belong in footnotes; a reformulation that says more than Kuki; a "rather than" contrast he does not make; a closing sentence that restates significance).
2. DROPS: a sentence, clause, qualification, example, citation, page reference, or emphasis (italics marking Kuki's 圏点) present in the literal.
3. CHANGES: a sense, a hedge ("perhaps", "I think"), a modality, a term against the glossary, or the attribution of a view (Kuki's own vs one he reports).
4. Breaks the house rules: em or en dashes; "not X but Y" / "X rather than Y" framing of our own; aphoristic closers; chiasmus; the words load-bearing, legible/legibility, honest/honesty, quietly, gestures towards, fundamental (outside titles), "chosen, not found"; commentary on how important a point is.
Joining sentences, reordering clauses, and "that is" / "this is to say" reformulations that restate Kuki without adding are the intended register: leave them.
If the literal itself looks wrong, check the image and report it separately.

## Output (do NOT edit the translation files)
Write readthrough/fixes-X.md (X = your part), appending as you go:

```
### p. N | ADDS | DROPS | CHANGES | RULE
OLD: <exact substring of the READABLE file, unique in the whole file (8-30 words)>
NEW: <corrected readable text, in the same register, British spelling, footnotes untouched unless the fix is in a footnote>
WHY: <one line, citing the literal wording>
```
OLD must match the readable file character for character (including footnote markers, italics, page markers). Keep NEW minimal: fix the fault, keep the rest. For dropped emphasis, give the phrase with italics added. Do not propose stylistic preferences.
Then `## Literal problems` (page, issue, what the image shows) and `## Summary` (counts by type; overall judgement of the range in two sentences).
No em or en dashes in your file.
