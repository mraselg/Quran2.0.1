import React, { useState } from "react";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { captureHighResImage } from "@/lib/exportUtils";
import { useReflowStore } from "@/state/reflowStore";

export function ExportManager() {
  const [isExporting, setIsExporting] = useState(false);
  const pages = useReflowStore(s => s.pages);

  const handleExportPDF = async () => {
    // Already implemented as print-preview and electron customPDF
    // The previous implementation used an IPC call for the whole document or window.print
    // Since we're in the renderer, let's call the existing save PDF flow.
    // For now, we will open the print preview route.
    window.open('/print-preview', '_blank');
  };

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      toast.loading("ক্যাপচার করা হচ্ছে... (Capture in progress)", { id: "export-image" });
      
      // Let's capture the current visible page or all pages?
      // Since it's a DTP workspace, users usually export one page at a time, or all.
      // We will capture the first `.artboard-page` element we find for now.
      const artboard = document.querySelector('.artboard-page') as HTMLElement;
      if (!artboard) {
        throw new Error("Artboard not found!");
      }

      const blob = await captureHighResImage(artboard);
      if (!blob) throw new Error("Failed to generate image blob");

      const arrayBuffer = await blob.arrayBuffer();

      // Ask for save path via Electron
      // @ts-ignore - electron IPC
      if (window.electronAPI) {
        // @ts-ignore
        const savePath = await window.electronAPI.invoke('dialog:saveImage', 'PageExport.png');
        if (savePath) {
          // @ts-ignore
          const res = await window.electronAPI.invoke('saveBuffer', { filePath: savePath, buffer: arrayBuffer });
          if (res.success) {
            toast.success("ইমেজ সেভ সম্পন্ন হয়েছে (Image saved successfully)", { id: "export-image" });
          } else {
            throw new Error(res.error);
          }
        } else {
          toast.dismiss("export-image");
        }
      } else {
        // Fallback for web browser:
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "PageExport.png";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("ইমেজ ডাউনলোড শুরু হয়েছে", { id: "export-image" });
      }

    } catch (e: any) {
      console.error(e);
      toast.error(`ইমেজ এক্সপোর্ট ব্যর্থ হয়েছে: ${e.message}`, { id: "export-image" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>এক্সপোর্ট অপশন</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <FileText className="w-4 h-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportImage} className="gap-2 cursor-pointer">
          <FileImage className="w-4 h-4" />
          <span>Export Current Page (PNG)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
