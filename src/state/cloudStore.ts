import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { useOverridesStore } from "./overridesStore";
import { useTemplateStore } from "./templateStore";
import { toast } from "sonner";

type CloudState = {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  syncToCloud: (isAutoSync?: boolean) => Promise<void>;
  pullFromCloud: () => Promise<void>;
};

export const useCloudStore = create<CloudState>((set) => ({
  isSyncing: false,
  lastSyncedAt: null,
  syncError: null,
  saveStatus: 'idle',

  syncToCloud: async (isAutoSync = false) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (isAutoSync) return; // Silent fail for auto-sync
        throw new Error("লগইন না করে ক্লাউডে সেভ করা সম্ভব নয়।");
      }

      set({ isSyncing: true, syncError: null, saveStatus: 'saving' });

      const overridesData = useOverridesStore.getState();
      const templateData = useTemplateStore.getState();
      const activeTemplateId = templateData.activeTemplateId || 'default-template';

      const payload = {
        user_id: session.user.id,
        template_id: activeTemplateId,
        state_payload: {
          global: overridesData.global,
          local: overridesData.local,
          globalSubRuleDx: overridesData.globalSubRuleDx,
        },
        updated_at: new Date().toISOString(),
      };

      // Upsert to user_projects table
      const { error } = await supabase
        .from("user_projects")
        .upsert(payload, { onConflict: "user_id,template_id" });

      if (error) throw error;

      set({ lastSyncedAt: new Date(), isSyncing: false, saveStatus: 'saved' });
      if (!isAutoSync) toast.success("ক্লাউডে সফলভাবে সেভ হয়েছে!");
    } catch (error: any) {
      set({ isSyncing: false, syncError: error.message, saveStatus: 'error' });
      if (!isAutoSync) toast.error(error.message);
    }
  },

  pullFromCloud: async () => {
    set({ isSyncing: true, syncError: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("লগইন না করে ক্লাউড থেকে ডাটা আনা সম্ভব নয়।");
      }

      const templateData = useTemplateStore.getState();
      const activeTemplateId = templateData.activeTemplateId || 'default-template';

      const { data, error } = await supabase
        .from("user_projects")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("template_id", activeTemplateId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is not found

      if (data && data.state_payload) {
        useOverridesStore.setState({
          global: data.state_payload.global || {},
          local: data.state_payload.local || {},
          globalSubRuleDx: data.state_payload.globalSubRuleDx || {},
        });
        toast.success("ক্লাউড থেকে সফলভাবে লোড হয়েছে!");
      }

      set({ lastSyncedAt: new Date(), isSyncing: false });
    } catch (error: any) {
      set({ isSyncing: false, syncError: error.message });
      toast.error(error.message);
    }
  },
}));

// Setup auto-sync
let syncTimeout: NodeJS.Timeout;

useOverridesStore.subscribe((state, prevState) => {
  // Simple check to prevent unnecessary syncs on identical states
  if (state === prevState) return;
  
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    useCloudStore.getState().syncToCloud(true).catch(console.error);
  }, 10000); // Debounce for 10 seconds
});
