const request = require("request");
const Downloader = require('nodejs-file-downloader');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const apd = require("appdata-path");
const fsExtra = require('fs-extra');

function createWindow () {
	const win = new BrowserWindow({
		width: 350,
		height: 500,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		},
		icon: './sources/icon.ico'
	});

	win.loadFile('./sources/index.html');
	win.removeMenu();
	win.setResizable(false);
	win.center();
}

app.whenReady().then(() => {
	createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	})
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('install', (event, arg) => {
	request('https://raw.githubusercontent.com/SanelRyan/JensModInstaller/main/list.json', {json:true}, (err, res, body) => {
		if (err) { return dialog.showMessageBox({
			message: "Failed to fetch mod list from cloud",
			type: "error",
			title: "Error!"
		}); }
		var toSelect = body.files;
		if (arg) {
			toSelect = body.premiumFiles;
		}
		fsExtra.emptyDirSync(apd(".minecraft/mods"));
		for (var i = toSelect.length - 1; i >= 0; i--) {
			const item = toSelect[i];		
			const downloader = new Downloader({
			url: item,	 
				directory: apd(".minecraft/mods"),
				cloneFiles:false
			})
			try {
				downloader.download();
			} catch (error) {
	
			}
		}
		dialog.showMessageBox({
			message: "Successfully installed all mods!",
			type: "info",
			title: "Success!"
		});
	});
});
