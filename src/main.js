const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let settingsWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无标题栏
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'main.html'));

  // 监听主窗口关闭事件
  mainWindow.on('closed', () => {
    // 关闭设置窗口
    if (settingsWindow) {
      settingsWindow.close();
      settingsWindow = null;
    }
    mainWindow = null;
  });

  // 监听打开设置窗口的事件
  ipcMain.on('open-settings', () => {
    if (settingsWindow) {
      settingsWindow.focus();
      return;
    }

    settingsWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false, // 无标题栏
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    settingsWindow.loadFile(path.join(__dirname, 'settings.html'));

    // 监听设置窗口关闭事件
    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  });

  // 监听语言切换事件
  ipcMain.on('set-language', (event, language) => {
    console.log('Language set to:', language);
    // 在这里实现语言切换逻辑
    if (language === 'zh-CN') {
      mainWindow.webContents.send('update-language', 'zh-CN');
    } else if (language === 'en') {
      mainWindow.webContents.send('update-language', 'en');
    }
  });
}

app.whenReady().then(createWindow);

// 窗口控制逻辑
ipcMain.on('window-minimize', () => {
  BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on('window-close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win === mainWindow) {
    // 关闭主窗口时，同时关闭设置窗口
    if (settingsWindow) {
      settingsWindow.close();
    }
  }
  win.close();
});