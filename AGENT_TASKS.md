# Agent Task Brief: Immediate Priorities

This document outlines the technical requirements and implementation steps for the 3 immediate tasks assigned for the **Studio Al-Qalam (Quran Studio Pro)** project. 

---

## 1. Task 1 (Supabase) 
**Objective:** Complete SQL schema (with RLS), strictly map payload in `cloudStore.ts`, and implement a save status indicator in the UI.

### 1.1 Complete SQL Schema
Please execute the following in the Supabase SQL editor:
```sql
CREATE TABLE user_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  template_id TEXT NOT NULL,
  state_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only select their own data
CREATE POLICY "Users can view their own projects"
  ON user_projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert/update their own data
CREATE POLICY "Users can upsert their own projects"
  ON user_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON user_projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 1.2 `cloudStore.ts` Payload & Save Status
- **Payload:** Extract ONLY the `layoutCache`, `pageConfigs`, and `wordOverrides` from `overridesStore` to keep the JSONB payload lightweight.
- **Save Status Indicator:** Add `saveStatus: 'idle' | 'saving' | 'saved' | 'error'` to the store. Update `Workspace.tsx` (TopBar area) to visually show "Saving..." or "All changes saved to cloud".

---

## 2. Task 2 (Onboarding)
**Objective:** Interactive tutorial using `react-joyride` in Bengali locale.

- **Install:** `npm install react-joyride`
- **Create `src/state/onboardingStore.ts`:**
  ```ts
  import { create } from 'zustand';
  import { persist } from 'zustand/middleware';

  type OnboardingStore = {
    hasSeenTutorial: boolean;
    setHasSeenTutorial: (val: boolean) => void;
  };

  export const useOnboardingStore = create<OnboardingStore>()(
    persist(
      (set) => ({
        hasSeenTutorial: false,
        setHasSeenTutorial: (val) => set({ hasSeenTutorial: val }),
      }),
      { name: 'quran-studio-onboarding' }
    )
  );
  ```
- **Joyride Integration (`Workspace.tsx`):**
  - Add `data-tour="type-tool"` to the Type Tool button.
  - Add `data-tour="select-tool"` to the Select Tool button.
  - Add `data-tour="scope-panel"` to the Scoping buttons (General, Page, Surah, Global).
  - Use `locale={{ back: 'পেছনে', close: 'বন্ধ', last: 'শেষ', next: 'সামনে', skip: 'বাদ দিন' }}`.

---

## 3. Task 3 (Reflow)
**Objective:** Multi-page layout reflows during inline editing.

- **Follow `PARAGRAPH_LINKING_PLAN.md`:** Strictly follow the 5-step paragraph linking plan already defined in the project.
- **Update `textReflow.ts`:** 
  - Locate the 3 places where an `early return` prevents reflow calculation when words are deleted, and remove those blockades.
  - Implement the `backFillFrom(currentPage, currentRow, wordCount)` logic to pull words from the *next* row into the *current* row when empty space is created.
- **Reserved Slot Protection:** Ensure that when shifting words backwards, we do not accidentally overwrite or shift words into "reserved slots" (like Bismillah headers or Ruku marks).

---

## ⚠️ Critical Rules
1. **Arabic Layer Protection:** Do not mutate or reflow Arabic text geometries. Reflows currently only apply to Meaning and Pronunciation layers.
2. **Zundo Undo/Redo Preserve:** Any programmatic state patches made during `backFillFrom` must be tracked by `zundo` so the user can hit `Ctrl+Z` to reverse the reflow.
3. **No Circular Imports:** Be extremely careful not to import `cloudStore` inside `overridesStore` or vice versa in a way that creates a circular dependency.
4. **Build Checks:** Run `npm run build` locally after completing each task to verify that Vite bundles successfully without circular dependency crashes.
