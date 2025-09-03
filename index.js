const path = require("path");

const electron = require("electron");
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

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
			contextIsolation: false,
			enableRemoteModule: true,
			nodeIntegration: true
		}
	})

	win.setMenu(null);
	win.maximize();
	win.loadFile(path.join("page", "index.html"));

	win.webContents.on('will-navigate', handleRedirect);

	remoteMain.enable(win.webContents);
}

electron.app.whenReady().then(createWindow);