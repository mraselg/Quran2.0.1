# Handoff Report: Draggable Surah Headers Implementation Plan

## 1. Observation
- The main canvas is `src/components/studio/Artboard.tsx`. Surah headers are mapped from `inlineSurahOpens` and rendered as `<SurahOpenBlock>` components.
- Drag-and-drop is currently implemented in `Artboard.tsx` via `onPointerDown`, `onPointerMove`, and `onPointerUp` (`endDrag`). It relies on elements having `data-sel-key` and `data-sel-kind` attributes.
- Snapping math already exists in `endDrag` for layer blocks: it checks `diff = Math.abs(boardY - rowCenter)` against `gridLayoutPx[i]`.
- Modals are provided by `src/context/ModalContext.tsx` via `useModal()`, which exposes `showConfirm`.
- The `contentEditable` text box is in `src/components/studio/UnifiedStoryEditor.tsx`. It uses a `polygonPath` for `shape-outside` to wrap text around Surah holes, and has an `outline: 2px dashed` around its parent container box, which currently does not visually contour around the Surah header exclusions.
- State is managed via Zustand. Page lines are stored in `src/state/reflowStore.ts` under `pages: PageData[]`. There is an existing helper `shiftQuranForward` that inserts blank slots to push text down.
- There is no existing `tests` or `e2e` directory in the root (`Get-ChildItem -Directory` returned `src`, `electron`, `dist`, etc.), nor any test scripts in `package.json`. Puppeteer packages exist in `node_modules/@puppeteer` as a transitive dependency.

## 2. Logic Chain
1. **Selectable and Draggable**: By modifying `Artboard.tsx` to wrap `SurahOpenBlock` in a `div` with `data-sel-kind="surah-open"` and `data-sel-key={"surah-open:" + index}`, the existing pointer events will pick it up and apply CSS `transform` visually.
2. **Magnetic Snapping**: In `endDrag` (`Artboard.tsx`), add a condition `if (scope === "general" && d.key.startsWith("surah-open:"))`. Calculate `boardY` and map to the nearest row in `gridLayoutPx` just like the `layer:` logic.
3. **Modal Dialog**: Once a drag is dropped on a valid new row, trigger `const confirmed = await showConfirm({ title: "Flow Text", message: "Flow text up to fill the gap?", confirmText: "Yes", cancelText: "No" })`.
4. **Store Update**: Add a `moveSurahHeader(pageId, oldSlotIndex, newSlotIndex, flowTextUp)` action to `reflowStore.ts`. It will locate the `surah-open` slot in `page.lines`, remove it, optionally shift the surrounding `ayah` slots based on `flowTextUp`, and insert the `surah-open` slot at the new index, then update `pages` and `distribution`.
5. **ContentEditable Bounds**: In `UnifiedStoryEditor.tsx`, the `outline` is applied to the rectangular parent `div`. To make it contour the text accurately, replace the `outline` CSS with a CSS `clip-path: polygon(...)` (or a styled SVG overlay with a dashed stroke) that traces the exact shape of the `polygonPath` used for `shape-outside`.
6. **Puppeteer Tests**: Because no test framework exists, an `e2e` directory should be created. The Puppeteer test should be placed at `e2e/surahDrag.test.ts`.

## 3. Caveats
- `rebuild()` in `reflowStore.ts` wipes out manual line ordering by regenerating from `verses.json`. If this manual drag state must survive a full rebuild, it will require adding an override layer (like `useOverridesStore.local`) specifically for Surah header positions, which is currently outside the `reflowStore` paradigm.
- The `clip-path` approach for the text area border might cut off half the stroke width, requiring adjustments to padding or using an explicit SVG overlay.

## 4. Conclusion
The implementation is feasible by extending the current `Artboard.tsx` pointer event handler and creating a new reflow action.

### Implementation Plan:
1. **`src/components/studio/Artboard.tsx`**: Add `data-sel-kind="surah-open"` and `data-sel-key="surah-open:INDEX"` to the Surah header wrapper. In `endDrag`, detect this key, find the closest `gridLayoutPx` index, and invoke `useModal().showConfirm(...)`.
2. **`src/state/reflowStore.ts`**: Add `moveSurahHeader` action to splice and re-order `page.lines` arrays.
3. **`src/components/studio/UnifiedStoryEditor.tsx`**: Remove the CSS `outline` from the overlay div. Apply `clip-path: polygon(...)` matching the `polygonPath` to conform the dashed border around the Surah header.
4. **E2E Testing**: Create `e2e/surahDrag.test.ts` where a Puppeteer instance launches the app, dispatches pointer down/move/up events to a `[data-sel-key^="surah-open:"]` element, and checks `document.querySelector('[role="dialog"]')` for the modal appearance.

## 5. Verification Method
1. Modify the `Artboard.tsx` and run the web app (`npm run dev:web`). Drag a Surah header and observe if it follows the cursor and snaps.
2. Confirm the Modal displays upon release.
3. Check that the dashed border in the Text Tool (`UnifiedStoryEditor`) traces the shape of the Surah header instead of a rectangle.
4. Run the Puppeteer script: `npx tsx e2e/surahDrag.test.ts` to simulate and assert the interaction.
