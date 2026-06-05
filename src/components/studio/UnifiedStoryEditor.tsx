import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { SelectionScope } from "@/state/editorStore";
import { useEditorStore } from "@/state/editorStore";
import { beginSilent, endSilent, type HistoryPatch, useHistoryStore } from "@/state/historyStore";
import { useOverridesStore } from "@/state/overridesStore";
import { useReflowStore } from "@/state/reflowStore";
import { reflowLayerText, splitToFitAware, reflowFrom, backFillFrom, reflowFromAsync, backFillFromAsync } from "@/lib/textReflow";
import { buildStory, storyToRowPatches, getEffectiveStoryRowText, STORY_ROW_SEPARATOR, parseHtmlToStoryPatches, type WordStylePatch } from "@/lib/textStory";
import { getValidTextSlotsForPages } from "@/lib/rowSlotMapper";
import type { StoryLayer } from "@/lib/rowSlotMapper";
import { ScopeImpactWarningDialog } from "./ScopeImpactWarningDialog";
import { SlotAllocationDialog } from "./SlotAllocationDialog";
import { useLargeChangeGuard } from "@/hooks/useLargeChangeGuard";
import type { StoryPatchPlan } from "@/lib/textStory";

export type UnifiedStoryEditorProps = {
  anchorPageId: string;
  scope: SelectionScope;
  layer: StoryLayer;
  fontFamily: string;
  fontSize: number;
  width: number;
  height: number;
  lineHeight: number;
  align: React.CSSProperties["textAlign"];
  baseline: number;
  marginTop?: number;
  holes?: Array<{ y: number; h: number }>;
  onClose: () => void;
};

export function UnifiedStoryEditor({
  anchorPageId,
  scope,
  layer,
  fontFamily,
  fontSize,
  width,
  height,
  lineHeight,
  align,
  baseline,
  marginTop = 0,
  holes = [],
  onClose,
}: UnifiedStoryEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [initialText, setInitialText] = useState("");
  const [pendingAllocation, setPendingAllocation] = useState<{ plan: StoryPatchPlan; newText: string; wordPatches?: WordStylePatch[] } | null>(null);
  const { request, dialogProps } = useLargeChangeGuard();
  const pages = useReflowStore((s) => s.pages);
  const distribution = useReflowStore((s) => s.distribution);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed && ref.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        setSelectionRect(range.getBoundingClientRect());
      } else {
        setSelectionRect(null);
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  useEffect(() => {
    const story = buildStory(scope, layer, anchorPageId, pages, distribution, useOverridesStore.getState().local);
    setInitialText(story.plainText);
  }, [anchorPageId, distribution, layer, pages, scope]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.innerText = initialText;

    el.focus();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [initialText]);

  const commit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const newText = el.innerText.replace(/\r\n/g, "\n").trim();
    if (newText === initialText.trim()) {
      onClose();
      return;
    }

    const local = useOverridesStore.getState().local;
    const story = buildStory(scope, layer, anchorPageId, pages, distribution, local);
    
    // Use the new HTML parser to extract plain text AND styles
    const htmlContent = el.innerHTML;
    const { plan, wordPatches } = parseHtmlToStoryPatches(story, htmlContent);

    if (plan.slotDelta.action === "inject") {
      setPendingAllocation({ plan, newText, wordPatches });
      return;
    }

    executeCommit(plan, wordPatches);
  }, [anchorPageId, distribution, layer, onClose, pages, scope]);

  const executeCommit = useCallback((plan: StoryPatchPlan, wordPatches: WordStylePatch[] = []) => {
    request({
      scope,
      estimatedRows: Math.max(1, plan.rowPatches.length),
      label: "স্টোরি কমিট হচ্ছে…",
      action: async () => {
        const store = useOverridesStore.getState();
        const patches: HistoryPatch[] = plan.rowPatches.map((patch) => ({
          field: "text",
          layerKey: patch.key,
          before: patch.beforeText,
          after: patch.text,
        }));

        beginSilent();
        try {
          const batch = plan.rowPatches.map(patch => ({
            key: patch.key,
            patch: { text: patch.text || undefined }
          }));
          
          // Add word patches from rich text edits!
          if (wordPatches.length > 0) {
            batch.push(...wordPatches);
          }
          
          store.patchLocalBatch(batch);
        } finally {
          endSilent();
        }

        if (patches.length > 0) {
          useHistoryStore.getState().pushStoryCommit({
            label: `story:${layer}`,
            labelBn: `${layer === "arabic" ? "আরবি" : "বাংলা"} স্টোরি পরিবর্তন`,
            scope,
            pageId: anchorPageId,
            layerKey: plan.rowPatches[0]?.key,
            rowIndex: plan.rowPatches[0]?.rowIndex,
            patches,
          });
        }

        const localMap = store.local;
        const layerKeyFn = (pid: string, ri: number, lyr: string) => `layer:${pid}:${ri}:${lyr}`;
        let currentOverflow = "";

        // Sequentially reflow all patched rows to push overflow forward
        for (const mapping of plan.story.rowMapping) {
          const lk = layerKeyFn(mapping.pageId, mapping.rowIndex, layer);
          const existingText = localMap[lk]?.text ?? "";
          const combined = currentOverflow ? currentOverflow + " " + existingText : existingText;

          const { fits, overflow } = splitToFitAware(
            combined,
            width,
            fontFamily,
            fontSize,
            layer,
            mapping.pageId,
            mapping.rowIndex,
            localMap,
            layerKeyFn
          );

          store.patchLocal(lk, { text: fits });
          currentOverflow = overflow.trim();
        }

        // Pass any remaining overflow to reflowFrom to cascade to subsequent pages
        if (currentOverflow) {
          const lastMapping = plan.story.rowMapping[plan.story.rowMapping.length - 1];
          if (lastMapping) {
            const pages = useReflowStore.getState().pages;
            await reflowFromAsync({
              startPageId: lastMapping.pageId,
              startRowIndex: lastMapping.rowIndex + 1,
              startOverflow: currentOverflow,
              layer,
              allPages: pages,
              localMap: store.local,
              patchLocal: store.patchLocal,
              layerKeyFn,
              fontFamily,
              fontSize,
              availableWidth: width,
            });
          }
        }

        // Pull text backward if gaps were created (e.g., text deleted)
        const firstMapping = plan.story.rowMapping[0];
        if (firstMapping) {
          const pages = useReflowStore.getState().pages;
          await backFillFromAsync({
            startPageId: firstMapping.pageId,
            startRowIndex: firstMapping.rowIndex,
            layer,
            allPages: pages,
            localMap: store.local,
            patchLocal: store.patchLocal,
            layerKeyFn,
            fontFamily,
            fontSize,
            availableWidth: width,
          });
        }

        onClose();
      },
      onCancel: onClose,
    });
  }, [anchorPageId, fontFamily, fontSize, layer, onClose, request, scope, width]);

  const handleAddPages = useCallback(() => {
    if (!pendingAllocation) return;
    const { plan, newText } = pendingAllocation;
    const { extraRowsNeeded } = plan.slotDelta;
    
    // Find the last page of the current story scope
    const lastPageId = plan.story.pageIds[plan.story.pageIds.length - 1];
    if (!lastPageId) return;

    const pages = useReflowStore.getState().pages;
    const lastPageIdx = pages.findIndex((p) => p.id === lastPageId);
    if (lastPageIdx < 0 || lastPageIdx + 1 >= pages.length) {
      toast.error("কুরআনের শেষে আর কোনো পেজ নেই!");
      setPendingAllocation(null);
      return;
    }

    const nextPageId = pages[lastPageIdx + 1].id;

    // Shift the Quran starting from the NEXT page
    useReflowStore.getState().shiftQuranForward(nextPageId, extraRowsNeeded);

    // Re-build story manually including the newly shifted pages to capture the overflow text
    const updatedPages = useReflowStore.getState().pages;
    const updatedDist = useReflowStore.getState().distribution;
    const local = useOverridesStore.getState().local;

    // We need to build a story that includes `plan.story.pageIds` PLUS the next pages where we shifted!
    const expandedPageIds = [...plan.story.pageIds];
    const pagesToInclude = Math.ceil(extraRowsNeeded / 9);
    for (let i = 0; i < pagesToInclude; i++) {
       const p = updatedPages[lastPageIdx + 1 + i];
       if (p) expandedPageIds.push(p.id);
    }

    // Now manually construct a story with expandedPageIds
    // Removed require, using statically imported functions
    
    const slots = getValidTextSlotsForPages(updatedPages, expandedPageIds, layer);
    const rows = slots.map((slot: any) => getEffectiveStoryRowText(slot.pageId, slot.rowIndex, layer, slot.text, local).trim());
    const rowMapping: any[] = [];
    let offset = 0;
    slots.forEach((slot: any, index: number) => {
      const text = rows[index] ?? "";
      const start = offset;
      const end = start + text.length;
      rowMapping.push({ pageId: slot.pageId, rowIndex: slot.rowIndex, layer, start, end, text });
      offset = end + STORY_ROW_SEPARATOR.length;
    });

    const expandedStory = { ...plan.story, pageIds: expandedPageIds, rowMapping, totalSlots: slots.length };
    
    // We would need to re-parse HTML to get accurate word patches, but for now we just use the plain text
    // since this is a rare edge case (adding new pages while formatting).
    const newPlan = storyToRowPatches(expandedStory, newText);

    setPendingAllocation(null);
    executeCommit(newPlan, pendingAllocation.wordPatches);
  }, [pendingAllocation, scope, layer, anchorPageId, executeCommit]);

  const handleClip = useCallback(() => {
    if (!pendingAllocation) return;
    const { plan, newText, wordPatches } = pendingAllocation;
    // Just commit what we can fit, clipping the rest. The rowPatches already drops overflow text.
    setPendingAllocation(null);
    executeCommit(plan, wordPatches);
  }, [pendingAllocation, executeCommit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      commit();
    }
  };

  // Create the polygon for CSS shape-outside to wrap text around Surah header holes
  const createPolygon = (holesList: Array<{ y: number; h: number }>, totalHeight: number) => {
    if (!holesList || holesList.length === 0) return "";
    let pts: string[] = [];
    pts.push(`0px 0px`);
    for (const h of holesList) {
      // Start of hole
      pts.push(`0px ${h.y}px`);
      pts.push(`100% ${h.y}px`);
      // End of hole
      pts.push(`100% ${h.y + h.h}px`);
      pts.push(`0px ${h.y + h.h}px`);
    }
    pts.push(`0px ${totalHeight}px`);
    return `polygon(${pts.join(", ")})`;
  };

  const polygonPath = createPolygon(holes, height);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 8,
          width: width - 16,
          height,
          zIndex: 50,
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: -1
          }}
        >
          {(() => {
            const regions = [];
            let currentY = 0;
            for (const h of holes) {
              if (h.y > currentY) {
                regions.push({ y: currentY, h: h.y - currentY });
              }
              currentY = h.y + h.h;
            }
            if (height > currentY) {
              regions.push({ y: currentY, h: height - currentY });
            }
            return regions.map((r, i) => (
              <rect
                key={i}
                x="2"
                y={r.y + 2}
                width={width - 16 - 4}
                height={r.h - 4}
                fill="none"
                stroke={layer === "arabic" ? "#f59e0b" : "#34d399"}
                strokeWidth="2"
                strokeDasharray="4 4"
                rx="4"
              />
            ));
          })()}
        </svg>
        {polygonPath && (
          <div 
            className="polygon-hole-maker"
            style={{
              float: layer === "arabic" ? "right" : "left", 
              width: "100%", 
              height: "100%", 
              shapeOutside: polygonPath,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          dir={layer === "arabic" ? "rtl" : "ltr"}
          lang={layer === "arabic" ? "ar" : "bn"}
          spellCheck={false}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            height: "100%",
            fontFamily,
            fontSize,
            lineHeight: `${lineHeight}px`,
            textAlign: align,
            textAlignLast: align === "justify" ? "justify" : undefined,
            color: layer === "arabic" ? "#f59e0b" : "#34d399",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            paddingTop: 0,
            marginTop: `${marginTop}px`,
            outline: "none"
          }}
        />
      </div>
      <div
        className="absolute left-2 top-2 z-[51] rounded px-2 py-1 text-[10px] font-bold"
        style={{ background: layer === "arabic" ? "#f59e0b" : "#34d399", color: "#111827" }}
      >
        {scope} · {layer === "arabic" ? "আরবি" : "বাংলা"} · Ctrl+Enter commit
      </div>
      
      {selectionRect && (
        <div
          className="fixed z-[60] flex items-center gap-1 rounded bg-neutral-800 p-1.5 shadow-lg border border-neutral-700 transition-opacity animate-in fade-in"
          style={{ top: Math.max(0, selectionRect.top - 45), left: selectionRect.left }}
        >
          <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("bold"); }} className="px-2.5 py-1 text-white hover:bg-neutral-700 font-serif font-bold rounded">B</button>
          <div className="w-px h-5 bg-neutral-700 mx-1" />
          <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("foreColor", false, "#f87171"); }} className="w-5 h-5 rounded-full bg-red-400 hover:ring-2 hover:ring-white transition-all"></button>
          <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("foreColor", false, "#60a5fa"); }} className="w-5 h-5 rounded-full bg-blue-400 hover:ring-2 hover:ring-white transition-all"></button>
          <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("foreColor", false, "#4ade80"); }} className="w-5 h-5 rounded-full bg-green-400 hover:ring-2 hover:ring-white transition-all"></button>
          <button onMouseDown={(e) => { e.preventDefault(); document.execCommand("foreColor", false, "#c084fc"); }} className="w-5 h-5 rounded-full bg-purple-400 hover:ring-2 hover:ring-white transition-all"></button>
        </div>
      )}

      <ScopeImpactWarningDialog {...dialogProps} />
      <SlotAllocationDialog
        open={pendingAllocation !== null}
        extraRowsNeeded={pendingAllocation?.plan.slotDelta.extraRowsNeeded}
        onAddPages={handleAddPages}
        onClip={handleClip}
        onCancel={() => setPendingAllocation(null)}
      />
    </>
  );
}
