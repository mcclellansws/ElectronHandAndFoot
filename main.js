/*jshint esversion: 6 */
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require("electron-updater");

autoUpdater.signals.progress
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const Store = require('electron-store');
const store = new Store({
  configName: 'user-preferences',
  defaults: {
    // set default size of window
    windowBounds: {
      width: 800, height: 1024,
    }
  }
});

function createWindow() {
  var args = store.get('windowBounds');
  args.webPreferences = {
    nodeIntegration: true
  }
  // Create the browser window.
  mainWindow = new BrowserWindow(args);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  function saveWindowBounds() {
    store.set('windowBounds', mainWindow.getBounds());
  }

  mainWindow.on('resize', saveWindowBounds);
  mainWindow.on('move', saveWindowBounds);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

function sendStatusToWindow(text) {
  mainWindow.webContents.send('updateStatusMessage', text);
}

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...');
// })
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available. Downloading...');
});

// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.');
// });

// autoUpdater.on('error', (err) => {
//   sendStatusToWindow('Error in auto-updater. ' + err);
// });

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (ev, info) => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  sendStatusToWindow('Update downloaded');
  
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
});

// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

