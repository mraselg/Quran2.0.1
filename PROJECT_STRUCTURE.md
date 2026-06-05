# Quran Studio Pro - AI Agent Project Architecture

This document provides a comprehensive technical overview and structure of the **Quran Studio Pro** web and desktop (Electron) application. It is specifically designed to onboard future AI coding agents or developers, explaining the core concepts, state management, file structure, and technical layout engine used to build this high-precision Quranic Desktop Publishing (DTP) software.

## 🛠️ Technology Stack
- **Framework:** React 18 with Vite
- **Routing:** TanStack Router (`src/router.tsx`, `src/routes/`)
- **State Management:** Zustand (multiple domain-specific stores in `src/state/`)
- **UI Components:** TailwindCSS, Radix UI, Lucide Icons, Custom UI components in `src/components/ui/`
- **Desktop Wrapper:** Electron (via `vite-plugin-electron`)
- **Database / Backend:** Supabase (for Authentication, Cloud Sync, and Database)

## 📁 Core Directory Structure

```text
C:\xampp\htdocs\new from ctg quran\
├── dist-electron/             # Compiled Electron build
├── src/                       # Main Source Code Directory
│   ├── assets/                # Static assets, SVGs, Tajweed icons
│   ├── components/            # React UI Components
│   │   ├── auth/              # Authentication components (AuthDialog.tsx)
│   │   ├── studio/            # The Core Editor / Studio Application
│   │   │   ├── Artboard.tsx           # The main canvas area for rendering Quran pages
│   │   │   ├── Workspace.tsx          # The main layout wrapper for the Studio
│   │   │   ├── PropertiesPanel.tsx    # Right sidebar for adjusting elements, styles, text properties
│   │   │   ├── LayerPanel.tsx         # Left sidebar for navigating pages/surahs/layers
│   │   │   ├── TopBar.tsx             # Main top navigation and tools (zoom, mode toggle, export)
│   │   │   ├── UnifiedStoryEditor.tsx # The WYSIWYG text editor for typing Arabic/Bangla
│   │   │   └── ...                    # Other components (GridLine, BismillahBox, etc.)
│   │   ├── ui/                # Reusable basic UI components (Buttons, Dialogs, Selects)
│   ├── lib/                   # Utility functions, business logic, layout calculations
│   │   ├── editorContext.tsx  # React Context for editor references
│   │   ├── pdfExport.ts       # Logic for exporting artboards to High-Res PDF
│   │   ├── reflowHelpers.ts   # Utilities for calculating page text reflow
│   │   ├── supabaseClient.ts  # Supabase initialization and connection
│   │   ├── textReflow.ts      # Core logic for moving text between lines/pages when editing
│   │   └── ...
│   ├── routes/                # TanStack Router File-Based Routes
│   │   ├── index.lazy.tsx     # The Dashboard / Home screen (`/`)
│   │   ├── editor.lazy.tsx    # The main Studio Editor route (`/editor`)
│   │   ├── template-builder...# Template creation routes
│   │   └── documentation...   # Documentation routes
│   ├── state/                 # Zustand Global State Stores
│   │   ├── cloudStore.ts      # Handles Supabase syncing, saving/loading projects
│   │   ├── editorStore.ts     # The MOST IMPORTANT store: holds active project, pages, lines, layers
│   │   ├── historyStore.ts    # Undo/Redo mechanism
│   │   ├── overridesStore.ts  # Tracks specific line/paragraph style overrides (font size, color)
│   │   ├── reflowStore.ts     # Manages text reflow states and background layout calculations
│   │   └── themeStore.ts      # Dark/Light mode, UI preferences
│   ├── styles.css             # Global CSS and Tailwind directives
│   ├── router.tsx             # Router configuration
│   └── start.ts               # Entry point for the React application
├── electron/                  # Electron main process scripts
├── public/                    # Public assets served by Vite
├── .env                       # Environment variables (VITE_SUPABASE_URL, etc.)
├── package.json               # Dependencies and npm scripts
└── vite.config.ts             # Vite configuration
```

## 🧠 Core Architecture & Workflow

### 1. Data Model (`src/state/editorStore.ts`)
The application uses a highly structured JSON data model to represent a Quran project.
- **Project:** Contains project metadata and an array of `Page` objects.
- **Page:** Represents a physical book page. Contains metadata (template type) and an array of `Line` objects (usually 9 to 15 lines).
- **Line:** Contains the actual text content (Arabic, Bangla, Symbols) and positioning data.
- **Overrides:** Visual overrides (like font size, colors, nudging) are stored separately in `overridesStore.ts` and merged at render time. This allows the core text data to remain clean while visual tweaks are applied independently.

### 2. The Layout Engine (`Artboard.tsx` & `FabricLines.tsx`)
Instead of a standard DOM text flow, this editor positions each line of text absolutely on an "Artboard" grid.
- **Surah Headers & Bismillah:** Special blocks that occupy grid space.
- **Text Alignment:** Handled via custom React components that render Arabic and Bangla text on top of each other or side-by-side based on the selected `Master Template`.

### 3. Text Editing & Reflow (`UnifiedStoryEditor.tsx` & `textReflow.ts`)
When a user double-clicks text, a full-screen or overlay text editor (`UnifiedStoryEditor`) opens.
- **Continuous Flow:** The text of the entire Surah/Chapter is loaded into a single `contentEditable` div or textarea.
- **Reflow Algorithm:** When the user types or deletes, the system takes the entire string of text, splits it by words/characters, and redistributes it back into the individual `Line` and `Page` objects (`textReflow.ts`).
- **Async Processing:** Heavy reflow operations are processed in chunks (`reflowFromAsync`) to prevent blocking the UI thread.

### 4. Authentication (`AuthDialog.tsx`)
- The app uses Supabase for auth.
- The UI is restricted to Login only (no Sign Up).
- Default login is `rasel88990` which auto-provisions a pseudo-email (`rasel88990@alqalam.local`) in the background.

## 🤖 Guide for Future AI Agents

When asked to implement a new feature or fix a bug, follow these rules:
1. **Find State:** If you need to change data, look in `src/state/`. Do NOT mutate state directly; always use the Zustand actions (e.g., `updateLine`, `updatePage`).
2. **Reflow:** If you change text content programmatically, you MUST trigger a reflow using `reflowFromAsync` or `backFillFromAsync` from `UnifiedStoryEditor` to ensure the layout matches the text.
3. **UI Components:** We use Radix UI and Tailwind. Check `src/components/ui/` for existing components like Buttons, Dialogs, and Selects before building from scratch.
4. **Icons:** We use `lucide-react`.
5. **No Native Modals:** Do not use `window.alert` or `window.confirm`. Use the custom dialog components or `sonner` (`toast`) for notifications.
6. **Dark Theme:** Always ensure your Tailwind classes support dark mode (e.g., `dark:bg-slate-800`).

## 🚀 Common Commands
- **Start Dev Server:** `npm run dev` (Runs both Vite web and Electron)
- **Start Web Only:** `npm run dev:web`
- **Build Web:** `npm run build`
- **Build Electron:** `npm run build:electron`

*Documentation updated on June 2026. For questions, refer to the individual component files which contain detailed JSDoc comments.*
