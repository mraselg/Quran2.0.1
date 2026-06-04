# Studio Al-Qalam (Quran Studio Pro) - Developer Guide

Welcome to the Studio Al-Qalam project! This file contains all the instructions, architecture details, and context you need to continue building this application.

## 🏗️ 1. Project Setup & Architecture
**Stack:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, Supabase, and Electron.
- **To run the web version:** 
  1. `npm install`
  2. `npm run dev`
- **To run the desktop version:** 
  1. `npm run start:electron`

## 🧩 2. Core Modules to Review
Please look into these specific files to understand how the system works:
- **Layout Engine (`src/components/studio/FabricLines.tsx` & `src/lib/templateUtils.ts`):** 
  We do not use standard text flow. We compute exact X/Y coordinates for every line of Arabic, Bengali, and Meaning text. `FabricLines.tsx` renders these absolute-positioned DOM nodes.
- **State Management (`src/state/overridesStore.ts`):** 
  This is the heart of the app. It uses Zustand to store X/Y nudges (`dx`, `dy`), colors, and font sizes when a user drags a word on the canvas. It supports robust scoping (General, Page, Surah, Global).
- **Rich Text Editor (`src/components/studio/UnifiedStoryEditor.tsx` & `src/lib/textStory.ts`):** 
  Handles inline `contenteditable` changes and uses DOMPurify to safely sync DOM modifications back to the Zustand store.
- **Cloud Sync (`src/state/cloudStore.ts`):** 
  Watches `overridesStore` and auto-saves to Supabase (debounced).
- **Electron API (`electron/main.ts` & `electron/preload.ts`):** 
  Handles native desktop menus (Ctrl+S, Export to PDF) and communicates via IPC to the React `Workspace.tsx` component.

## 🎯 3. Your Immediate Tasks
Now that you have the full context and codebase, here is your task list:

1. **Supabase Database Schema Finalization:** 
   Our `cloudStore.ts` currently attempts to upsert data into a table called `user_projects`. Please log into our Supabase dashboard, create this table to accept JSON payloads for layout states, and strictly configure the Row Level Security (RLS) policies so users can only access their own data.
2. **Interactive Onboarding (Tutorial):** 
   Add a library like `react-joyride` to create an interactive tour when a user opens the Editor for the first time. Show them how to use the "Type Tool", "Select Tool", and how to drag text.
3. **Multi-page Layout Reflows (Advanced):** 
   Currently, deleting a large chunk of text requires the layout engine to reflow lines. Review `src/lib/typographyReflow.ts` and `reflowStore.ts`. Ensure that if a user deletes a word via the inline editor, the subsequent text properly shifts backward across packed pages without breaking the grid.

Please review the codebase. We look forward to your technical plan for implementing these 3 tasks.
