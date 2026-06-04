import type { PageData } from "@/data/pages";
import type { SelectionScope } from "@/state/editorStore";
import type { LocalOverride } from "@/state/overridesStore";
import type { PageDistribution } from "@/state/reflowStore";
import { resolveTargetPageIds } from "@/lib/scopeTargets";
import {
  computeSlotDelta,
  getValidTextSlotsForPages,
  type SlotDeltaPlan,
  type StoryLayer,
} from "@/lib/rowSlotMapper";

export type TextStoryRowMapping = {
  pageId: string;
  rowIndex: number;
  layer: StoryLayer;
  start: number;
  end: number;
  text: string;
};

export type TextStory = {
  id: string;
  scope: SelectionScope;
  layer: StoryLayer;
  anchorPageId: string;
  pageIds: string[];
  plainText: string;
  rows: string[];
  rowMapping: TextStoryRowMapping[];
  totalSlots: number;
  usedSlots: number;
};

export type StoryRowPatch = {
  key: string;
  pageId: string;
  rowIndex: number;
  layer: StoryLayer;
  beforeText: string;
  text: string;
};

export type StoryPatchPlan = {
  story: TextStory;
  rowPatches: StoryRowPatch[];
  slotDelta: SlotDeltaPlan;
};

export const STORY_ROW_SEPARATOR = "\n";

function layerKey(pageId: string, rowIndex: number, layer: StoryLayer): string {
  return `layer:${pageId}:${rowIndex}:${layer}`;
}

function normalizeStoryRows(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((row) => row.trim());
}

export function getEffectiveStoryRowText(
  pageId: string,
  rowIndex: number,
  layer: StoryLayer,
  fallbackText: string,
  localOverrides: Record<string, LocalOverride>,
): string {
  return localOverrides[layerKey(pageId, rowIndex, layer)]?.text ?? fallbackText;
}

export function buildStory(
  scope: SelectionScope,
  layer: StoryLayer,
  anchorPageId: string,
  pages: PageData[],
  distribution: PageDistribution[],
  localOverrides: Record<string, LocalOverride>,
): TextStory {
  const pageIds = resolveTargetPageIds(scope, anchorPageId, pages, distribution);
  const slots = getValidTextSlotsForPages(pages, pageIds, layer);
  const rows = slots.map((slot) =>
    getEffectiveStoryRowText(slot.pageId, slot.rowIndex, layer, slot.text, localOverrides).trim(),
  );
  const nonEmptyRowsCount = rows.filter((row) => row.length > 0).length;
  const rowMapping: TextStoryRowMapping[] = [];
  let offset = 0;

  slots.forEach((slot, index) => {
    const text = rows[index] ?? "";
    const start = offset;
    const end = start + text.length;
    rowMapping.push({ pageId: slot.pageId, rowIndex: slot.rowIndex, layer, start, end, text });
    offset = end + STORY_ROW_SEPARATOR.length;
  });

  return {
    id: `${scope}:${layer}:${anchorPageId}`,
    scope,
    layer,
    anchorPageId,
    pageIds,
    plainText: rows.join(STORY_ROW_SEPARATOR),
    rows,
    rowMapping,
    totalSlots: slots.length,
    usedSlots: nonEmptyRowsCount,
  };
}

import DOMPurify from 'dompurify';

export function storyToRowPatches(story: TextStory, newPlainText: string): StoryPatchPlan {
  const nextRows = normalizeStoryRows(newPlainText);
  const slotDelta = computeSlotDelta(story.totalSlots, nextRows.length);
  const rowPatches: StoryRowPatch[] = [];

  story.rowMapping.forEach((mapping, index) => {
    const text = nextRows[index] ?? "";
    if (text === mapping.text) return;
    rowPatches.push({
      key: layerKey(mapping.pageId, mapping.rowIndex, story.layer),
      pageId: mapping.pageId,
      rowIndex: mapping.rowIndex,
      layer: story.layer,
      beforeText: mapping.text,
      text,
    });
  });

  return { story, rowPatches, slotDelta };
}

export type WordStylePatch = {
  key: string;
  patch: {
    color?: string;
    fontWeight?: string | number;
  };
};

export function parseHtmlToStoryPatches(story: TextStory, html: string): { plan: StoryPatchPlan; wordPatches: WordStylePatch[] } {
  // 1. Sanitize HTML
  const cleanHtml = DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'strong', 'span', 'font', 'div', 'br', 'p'], ALLOWED_ATTR: ['style', 'color'] });
  
  // 2. Parse into DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, 'text/html');
  
  let plainText = "";
  const wordPatches: WordStylePatch[] = [];
  
  // We need to map global string index to row -> wordIndex
  const recordWordStyle = (globalStart: number, textSpan: string, color?: string, weight?: string) => {
    if (!color && !weight) return;
    
    // Iterate through characters of the span
    for (let i = 0; i < textSpan.length; i++) {
      const charGlobalIndex = globalStart + i;
      // Skip whitespace
      if (textSpan[i].trim() === "") continue;
      
      // Find which row this character falls into
      const rowMap = story.rowMapping.find(m => charGlobalIndex >= m.start && charGlobalIndex < m.end);
      if (rowMap) {
        // Find which word index inside this row
        const rowLocalOffset = charGlobalIndex - rowMap.start;
        const rowTextBeforeChar = rowMap.text.substring(0, rowLocalOffset);
        const wordIndex = rowTextBeforeChar.split(/\s+/).length - 1;
        
        // Generate the key
        const key = `word:${rowMap.pageId}:${rowMap.rowIndex}:${wordIndex}`;
        
        // Add to patches if not already there
        let existing = wordPatches.find(p => p.key === key);
        if (!existing) {
          existing = { key, patch: {} };
          wordPatches.push(existing);
        }
        if (color) existing.patch.color = color;
        if (weight) existing.patch.fontWeight = weight;
      }
    }
  };

  const walk = (node: Node, currentColor?: string, currentWeight?: string) => {
    let color = currentColor;
    let weight = currentWeight;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === 'b' || tag === 'strong') weight = 'bold';
      if (el.style && el.style.color) color = el.style.color;
      if (el.getAttribute('color')) color = el.getAttribute('color')!;
      
      if (tag === 'div' || tag === 'p' || tag === 'br') {
        if (plainText.length > 0 && !plainText.endsWith('\n')) {
          plainText += '\n';
        }
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const currentGlobalStart = plainText.length;
      plainText += text;
      
      recordWordStyle(currentGlobalStart, text, color, weight);
    }

    node.childNodes.forEach(child => walk(child, color, weight));
  };
  
  walk(doc.body);
  
  const plan = storyToRowPatches(story, plainText);
  return { plan, wordPatches };
}
