import { contextBridge, ipcRenderer } from 'electron';

// Expose a safe, context-isolated API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  saveFileDialog: (defaultName: string): Promise<string | undefined> =>
    ipcRenderer.invoke('dialog:saveFile', defaultName),

  exportPrintToPDF: (savePath: string): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('export:printToPDF', savePath),

  exportCustomPDF: (payload: any): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('export:customPDF', payload),

  logEvent: (eventType: string, details: string): Promise<boolean> => 
    ipcRenderer.invoke('db:logEvent', { eventType, details }),

  getLogs: (): Promise<any[]> => 
    ipcRenderer.invoke('db:getLogs'),

  clearLogs: (): Promise<boolean> => 
    ipcRenderer.invoke('db:clearLogs'),

  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_event, action) => callback(action));
  },
});
