import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItemConstructorOptions } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleExportPDF } from './pdfExport.js';
import { renderToPDF } from './pdfRenderer.js';

// Resolve __dirname since the bundle is standard ES/CJS
const isDev = process.env.NODE_ENV === 'development';

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist-electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    title: 'Quran Studio Pro',
  });

  if (isDev) {
    // In dev: load Vite dev server on port 8080
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();
  } else {
    // In production: load the built output
    win.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
  }

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  const isMac = process.platform === 'darwin';
  const template: MenuItemConstructorOptions[] = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] as MenuItemConstructorOptions[] : []),
    {
      label: 'File',
      submenu: [
        { label: 'Save / Sync', accelerator: 'CmdOrCtrl+S', click: () => win.webContents.send('menu-action', 'sync') },
        { label: 'Export to PDF', accelerator: 'CmdOrCtrl+E', click: () => win.webContents.send('menu-action', 'export-pdf') },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', click: () => win.webContents.send('menu-action', 'undo') },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', click: () => win.webContents.send('menu-action', 'redo') },
        { type: 'separator' },
        { label: 'Toggle Edit Mode', accelerator: 'E', click: () => win.webContents.send('menu-action', 'toggle-edit') }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // IPC handlers
  ipcMain.handle('dialog:saveFile', async (_, defaultName: string) => {
    const { filePath } = await dialog.showSaveDialog(win, {
      defaultPath: defaultName,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    return filePath;
  });

  ipcMain.handle('dialog:saveImage', async (_, defaultName: string) => {
    const { filePath } = await dialog.showSaveDialog(win, {
      defaultPath: defaultName,
      filters: [{ name: 'PNG Image', extensions: ['png'] }],
    });
    return filePath;
  });

  ipcMain.handle('saveBuffer', async (_, payload: { filePath: string; buffer: ArrayBuffer }) => {
    try {
      const fs = (await import('fs')).default;
      fs.writeFileSync(payload.filePath, Buffer.from(payload.buffer));
      return { success: true };
    } catch (e: any) {
      console.error('[electron] failed to save buffer', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('export:printToPDF', async (_, savePath: string) => {
    return handleExportPDF(win, savePath);
  });

  ipcMain.handle('export:customPDF', async (_, payload: { pages: any[]; outputPath: string }) => {
    try {
      const fontDir = isDev
        ? path.join(app.getAppPath(), 'public', 'fonts')
        : path.join(process.resourcesPath, 'fonts');

      await renderToPDF(payload.pages, {
        arabic: path.join(fontDir, 'ExcellentArabicWeb2.0.ttf'),
        bangla: path.join(fontDir, 'kalpurush.ttf'),
      }, payload.outputPath);

      return { success: true };
    } catch (e: any) {
      console.error('[electron] custom PDF export failed', e);
      return { success: false, error: e.message };
    }
  });

  // Database History Handlers
  ipcMain.handle('db:logEvent', async (_, payload: { eventType: string; details: string }) => {
    try {
      const { logEvent } = await import('./db.js');
      return logEvent(payload.eventType, payload.details);
    } catch (e) {
      console.error("DB log error:", e);
      return false;
    }
  });

  ipcMain.handle('db:getLogs', async () => {
    try {
      const { getHistoryLogs } = await import('./db.js');
      return getHistoryLogs();
    } catch (e) {
      console.error("DB get logs error:", e);
      return [];
    }
  });

  ipcMain.handle('db:clearLogs', async () => {
    try {
      const { clearHistoryLogs } = await import('./db.js');
      return clearHistoryLogs();
    } catch (e) {
      return false;
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
