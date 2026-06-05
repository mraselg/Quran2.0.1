import { useThemeStore } from "@/state/themeStore";
import { Palette, Check, LayoutGrid, Maximize } from "lucide-react";

const PRESET_COLORS = [
  { name: "Amber Glow", hex: "#f59e0b" },
  { name: "Ocean Night", hex: "#0ea5e9" },
  { name: "Emerald Forest", hex: "#10b981" },
  { name: "Royal Purple", hex: "#8b5cf6" },
  { name: "Rose Petal", hex: "#f43f5e" },
  { name: "Slate Grey", hex: "#64748b" },
];

export function ThemeSettings() {
  const { primaryColor, layoutMode, setPrimaryColor, setLayoutMode } = useThemeStore();

  return (
    <div className="mt-16 border-t border-neutral-800/50 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="w-6 h-6 text-amber-400" /> এডিটর থিম সেটিংস
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colors */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 text-neutral-300">প্রাইমারি কালার (Primary Color)</h3>
          <div className="flex flex-wrap gap-4">
            {PRESET_COLORS.map((color) => {
              const isSelected = primaryColor.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.name}
                  onClick={() => setPrimaryColor(color.hex)}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    isSelected ? "ring-2 ring-offset-2 ring-offset-neutral-950 ring-amber-400 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && <Check className="w-5 h-5 text-white drop-shadow-md" />}
                </button>
              );
            })}
            
            <div className="relative flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dashed border-neutral-700 hover:border-amber-500/50 transition-colors">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                  title="Custom Color"
                />
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            এই কালারটি সম্পূর্ণ এডিটরের বাটন, বর্ডার এবং ফোকাস রিং-এ ব্যবহার হবে।
          </p>
        </div>

        {/* Layout */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 text-neutral-300">এডিটর লেআউট (Editor Layout)</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLayoutMode("compact")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                layoutMode === "compact"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              <LayoutGrid className="w-8 h-8" />
              <span className="font-bold">কম্প্যাক্ট মোড</span>
            </button>
            <button
              onClick={() => setLayoutMode("spacious")}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                layoutMode === "spacious"
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              <Maximize className="w-8 h-8" />
              <span className="font-bold">স্পেশিয়াস মোড</span>
            </button>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            এডিটরের ওয়ার্কস্পেসের স্পেসিং এবং প্যাডিং নির্ধারণ করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
