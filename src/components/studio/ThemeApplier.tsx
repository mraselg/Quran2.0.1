import { useEffect } from "react";
import { useThemeStore } from "@/state/themeStore";

// Helper to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Generate a simple palette from a base color
function generatePalette(baseHex: string) {
  // If the user picked a pre-defined name (e.g., 'amber', 'emerald'), this is handled differently.
  // But assuming we store hex codes in the store:
  const rgb = hexToRgb(baseHex);
  if (!rgb) return "";

  // Very simplified palette generation for the UI
  // We override the 'amber' variables since the app hardcodes 'amber' as the primary accent.
  return `
    :root {
      --color-amber-50: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1);
      --color-amber-100: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2);
      --color-amber-200: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3);
      --color-amber-300: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5);
      --color-amber-400: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8);
      --color-amber-500: ${baseHex};
      --color-amber-600: rgba(${Math.max(rgb.r - 30, 0)}, ${Math.max(rgb.g - 30, 0)}, ${Math.max(rgb.b - 30, 0)}, 1);
      --color-amber-700: rgba(${Math.max(rgb.r - 60, 0)}, ${Math.max(rgb.g - 60, 0)}, ${Math.max(rgb.b - 60, 0)}, 1);
      --color-amber-800: rgba(${Math.max(rgb.r - 90, 0)}, ${Math.max(rgb.g - 90, 0)}, ${Math.max(rgb.b - 90, 0)}, 1);
      --color-amber-900: rgba(${Math.max(rgb.r - 120, 0)}, ${Math.max(rgb.g - 120, 0)}, ${Math.max(rgb.b - 120, 0)}, 1);
      --color-amber-950: rgba(${Math.max(rgb.r - 150, 0)}, ${Math.max(rgb.g - 150, 0)}, ${Math.max(rgb.b - 150, 0)}, 1);
    }
    
    /* Layout Mode Adjustments */
    .layout-spacious .artboard-container {
       padding: 4rem;
    }
  `;
}

export function ThemeApplier() {
  const { primaryColor, layoutMode } = useThemeStore();

  useEffect(() => {
    if (layoutMode === "spacious") {
      document.body.classList.add("layout-spacious");
    } else {
      document.body.classList.remove("layout-spacious");
    }
  }, [layoutMode]);

  return (
    <style dangerouslySetInnerHTML={{ __html: generatePalette(primaryColor) }} />
  );
}
