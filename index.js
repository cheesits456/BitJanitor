const path = require("path");

const electron = require("electron");

function createWindow() {
	const win = new electron.BrowserWindow({
		width: 1150,
		height: 600,
		minWidth: 1150,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	})

	// win.setMenu(null);
	win.maximize();
	win.loadFile(path.join("page", "index.html"));

	// win.webContents.on('new-window', (e, url) => {
	// 	e.preventDefault();
	// 	electron.shell.openExternal(url);
	// });

}

electron.app.whenReady().then(createWindow);