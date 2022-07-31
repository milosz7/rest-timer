import path from 'path';
import electron from 'electron';

const { app, BrowserWindow } = electron;

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join('app', 'script.js'),
    },
    width: 520,
    height: 650,
    minHeight: 650,
    minWidth: 400,
    frame: false,
  });

  mainWindow.loadFile(path.join('app', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
};

app.whenReady().then(() => {
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
