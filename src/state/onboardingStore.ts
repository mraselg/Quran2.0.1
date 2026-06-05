import { create } from "zustand";
import { persist } from "zustand/middleware";

type OnboardingState = {
  hasSeenTutorial: boolean;
  completeTutorial: () => void;
  resetTutorial: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      completeTutorial: () => set({ hasSeenTutorial: true }),
      resetTutorial: () => set({ hasSeenTutorial: false }),
    }),
    {
      name: "studio-onboarding",
    }
  )
);
