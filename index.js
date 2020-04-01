const { app, BrowserWindow } = require("electron"),
  path = require("path");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1050,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.setMenu(null);
  win.maximize();
  win.loadFile(path.join("render", "index.html"));

  win.webContents.on('new-window', function(e, url) {
  e.preventDefault();
  require('electron').shell.openExternal(url);
});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
