const path = require("path");

const electron = require("electron");
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

function createWindow() {

	const handleRedirect = (e, url) => {
		if (!url.startsWith("http")) return;
		e.preventDefault();
		electron.shell.openExternal(url);

	}

	const window = new electron.BrowserWindow({
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

	window.removeMenu();
	window.maximize();
	window.loadFile(path.join("page", "index.html"));

	window.on("resize", window.maximize);
	window.webContents.on('will-navigate', handleRedirect);

	remoteMain.enable(window.webContents);
}

electron.app.whenReady().then(createWindow);

process.on('uncaughtException', function (err) {
   console.log(err);
});