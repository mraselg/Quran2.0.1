import { create } from "zustand";
import { persist } from "zustand/middleware";

type LayoutMode = "compact" | "spacious";

type ThemeState = {
  primaryColor: string;
  layoutMode: LayoutMode;
  setPrimaryColor: (color: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: "#FF7D00", // Default orange/amber
      layoutMode: "compact", // Default layout
      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        window.electronAPI?.logEvent?.("Theme Changed", `Primary color set to ${color}`);
      },
      setLayoutMode: (mode) => {
        set({ layoutMode: mode });
        window.electronAPI?.logEvent?.("Layout Changed", `Layout mode set to ${mode}`);
      },
    }),
    {
      name: "quran-studio-theme",
    }
  )
);
