const path = require("path");

const electron = require("electron");

function createWindow() {

	const handleRedirect = (e, url) => {
		if (url.startsWith("http")) {
			e.preventDefault()
			electron.shell.openExternal(url)
		}
	}

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

	win.setMenu(null);
	win.maximize();
	win.loadFile(path.join("page", "index.html"));

	win.webContents.on('will-navigate', handleRedirect)
}

electron.app.whenReady().then(createWindow);