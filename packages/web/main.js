/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'build' });
const debug = require('electron-debug');

let mainWindow;

function isDev() {
  return !app.isPackaged;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 920,
    minWidth: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: isDev() ? path.join(process.cwd(), 'public/logo-512.png') : path.join(__dirname, 'build/logo-512.png'),
    show: false,
  });

  mainWindow.setMenu(null);

  if (isDev()) {
    debug();
    mainWindow.loadURL('http://localhost:3000/');
  } else {
    loadURL(mainWindow);
  }

  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
