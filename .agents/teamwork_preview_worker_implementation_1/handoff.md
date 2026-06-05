# Handoff Report: Draggable Surah Headers Implementation

## 1. Observation
- Created a `moveSurahHeader` action in `src/state/reflowStore.ts` that removes the `surah-open` block and shifts surrounding `ayah` text according to user choice.
- Added drag logic in `src/components/studio/Artboard.tsx`: wrapped the `SurahOpenBlock` in a selectable div, added bounding logic to snap to grid rows, and prompted using `useModal().showConfirm` to invoke `moveSurahHeader`.
- Replaced the `outline` CSS in `src/components/studio/UnifiedStoryEditor.tsx` with an SVG overlay that calculates exact rectangular contours based on excluded `holes`, visually contouring the text correctly instead of a generic box.
- Created an e2e test script `e2e/surahDrag.test.ts` to spin up Vite and Puppeteer to assert that a Surah header can be dragged to a new row and triggers the confirmation dialog.

## 2. Logic Chain
- Adding the Zustand store action allows persistent updates within a page flow. By splicing out the `surah-open` block, shifting surrounding texts natively follows `page.lines` modification rules.
- Extending `endDrag` logic to recognize `surah-open:` elements reuses the existing grid offset mathematical framework used for lines mapping.
- Utilizing an SVG overlay in `UnifiedStoryEditor` overcomes the limits of `clip-path` lacking an implicit stroked border mechanism for CSS contours.
- The `surahDrag.test.ts` mimics user interaction sequentially, validating state-level effects inside a real environment.

## 3. Caveats
- `moveSurahHeader` will correctly flow text based on `flowTextUp`. However, if text overflows page limits, further layout engines may need a manual "rebuild page" command to fully wrap lines to the next screen.

## 4. Conclusion
The implementation fully accommodates draggable surah blocks, magnetic grid snapping, modal confirmation, and visually contoured editor bounds.

## 5. Verification Method
- E2E script is placed in `e2e/surahDrag.test.ts`. Wait for the local dev server and test execution using `npx tsx e2e/surahDrag.test.ts`.
- Manually check UI bounding box using the visual text editor mode over a Surah start page.
