// main.js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;  // ► declare your window variable here

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Optional: remove default menu for a cleaner look
  Menu.setApplicationMenu(null);

  mainWindow.loadFile('index.html');

  // Uncomment to open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On macOS it’s common to keep the app alive until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, recreate the window if the dock icon is clicked & no windows are open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
