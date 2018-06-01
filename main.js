/*
**  Nuxt
*/
const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
const fs = require('fs-extra')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
const testAppSync = false
if (config.dev || testAppSync) {
	console.log('indev')
	builder.build().catch(err => {
		console.error(err) // eslint-disable-line no-console
		process.exit(1)
	})
}
// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron
*/
let win = null // Current window
const { app, Menu, BrowserWindow, webFrame, net, protocol, ipcMain } = require('electron')

const path = require('path')

//const extract = require('extract-zip')
const Downloader = require('mt-files-downloader');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
var url = require("url")
var curDls = 0; // Number of current download in progress
const simultaneousDownload = 5; // As indicated by his name :)
var downloader = new Downloader();

var dlStats = require(app.getAppPath() + '/static/js/dlStats')
var appPath = app.getAppPath()
/*
var registerDlEvents = function (num, dl) {
	handleEvents(dl, num);
	printStats(dl, num);
};
*/

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// Get a path to prepend to any nodejs calls that are getting at files in the package,
// so that it works both from source and in an asar-packaged mac app.
// See https://github.com/electron-userland/electron-builder/issues/751
function directoryAdjustment() {
	const appPath = app.getAppPath();
	// windows from source: "C:\myapp\node_modules\electron\dist\resources\default_app.asar"
	// mac from source: "/Users/me/dev/myapp/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar"
	// mac from a package: <somewhere>"/my.app/Contents/Resources/app.asar"
	if (appPath.indexOf("default_app.asar") < 0) {
		return appPath
		//return "";
	} else {
		// If we are run from outside of a packaged app, our working directory is the right place to be.
		// And no, we can't just set our working directory to somewhere inside the asar. The OS can't handle that.
		return "";
		return appPath
	}
}

function cleanUpFiles(remoteFiles) {
	win.webContents.send('cleaningFiles');
	var remoteFiles = remoteFiles
	var filesLength = remoteFiles.length
	var directories = [directoryAdjustment() + '/static/images/uploads', directoryAdjustment() + '/content']
	var skip = true

	function matchRemote(file) {
		return remoteFiles.some(item => item.path.includes(file))
	}

	function getFilesRecursive(folder) {
		var fileContents = fs.readdirSync(folder),
			fileTree = [],
			stats;

		fileContents.forEach(function (fileName) {
			stats = fs.lstatSync(folder + '/' + fileName);

			if (stats.isDirectory()) {
				fileTree.push({
					name: fileName,
					children: getFilesRecursive(folder + '/' + fileName)
				});
			} else {
				var filePresent = matchRemote(fileName)
				if (!fileName.includes(".mtd") && !fileName.includes(".DS_Store") && !filePresent) {
					console.log('delete', fileName)
					fs.unlink(path.join(folder, fileName), err => {
						if (err) throw err;
					});
					//	arr.push(file);
				}
				fileTree.push({
					name: fileName
				});
			}
		});

		return fileTree;
	};

	for (var i = 0; i < directories.length; ++i) {
		var directory = directories[i]
		console.log(directory, 'dir')
		getFilesRecursive(directory)

	}
	console.log('rebuildit')
	//app.relaunch()
	//	app.exit(0)
	function reloadHome() {
		//win.webContents.send('reloadNuxt', _NUXT_URL_);
		
		//console.log('loadHome',_NUXT_URL_)
		//win.loadURL(_NUXT_URL_)
	}
	//reloadHome()
	win.webContents.send('rebuilding', null);
	builder.build().catch(err => {
		console.error(err) // eslint-disable-line no-console
		process.exit(1)
	})
	nuxt.hook('build:done', async builder => {
		win.webContents.send('restarting', null);
		setTimeout(function () {
			app.relaunch()
			app.exit(0)
		}, 1000)
		//reloadHome()
	})

}
function getFilesizeInBytes(filename) {
	const stats = fs.statSync(filename)
	const fileSizeInBytes = stats.size
	return fileSizeInBytes
}

var downloadFiles = function (links) {
	var downloads = []
	downloads['curDls'] = 0;

	var linksLength = links.length
	for (var i = 0; i < linksLength; ++i) {
		//console.log(i)
		var link = 'https://raw.githubusercontent.com/kkosma/sssc-app/master/' + links[i].path
		var file_name = path.basename(decodeURI(url.parse(link).pathname))
		//console.log(app.getAppPath() + '/' + path.dirname(links[i].path), 'ptath', directoryAdjustment() + '/' + path.dirname(links[i].path))
		fs.ensureDirSync(path.join(__dirname, '/' + path.dirname(links[i].path)));
		//path.join(__dirname, '/' + path.dirname(links[i].path));
		var file_path = path.join(directoryAdjustment() + '/' + links[i].path)
		//console.log(link,file_name,file_path)

		if (links[i].path.includes('images/uploads') && fs.existsSync(file_path)) {
			var fileSize = getFilesizeInBytes(file_path)
			//console.log(fileSize, 'size', links[i].size)
			fileSize = fileSize
			if (links[i].size == fileSize) { continue; }
		}
		downloads['curDls']++;
		downloads[i] = downloader.download(link, file_path)
		downloads[i].name = file_name
		downloads[i].start()
		downloads[i].on('start', function (item) {
			//	console.log('Download of ' + item.name + ' started !')
		});
		downloads[i].on('end', function (item) {
			downloads['curDls']--;
			console.log(downloads['curDls'], 'curdls')
			if (downloads['curDls'] == 0) {
				win.webContents.send('doneLoading', null);
				cleanUpFiles(links)
			}
			//console.log('Download of ' + item.name + ' finished !')
		});
		downloads[i].on('error', function (item) {
			downloads['curDls']--;
			if (downloads['curDls'] == 0) {
				win.webContents.send('doneLoading', null);
				cleanUpFiles(links)
			}
			console.log('Error with ' + item.name)
		});

	}
	dlStats(i, downloads, win);
}
var getGitUrls = function () {
	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'update.html')
	})
	win.loadURL(url)
	win.webContents.send('loading', 'do something for me');
	let body = ''
	let found
	function getContent(value) {
		//value.path.includes('content') ||
		return (value.path.includes('content') || value.path.includes('images/uploads')) && value.type == 'blob'
	}
	var request = net.request(
		{
			url: 'https://api.github.com/repos/kkosma/sssc-app/git/trees/master?recursive=1',
			auth: 'kkosma'
		})
	request.on('response', (response) => {
		console.log(`STATUS: ${response.statusCode}`);
		//console.log(response,'response')
		response.on('error', (error) => {
			console.log(`ERROR: ${JSON.stringify(error)}`)
		})
		response.on('data', (chunk) => {
			//console.log(`${chunk}`)
			body += chunk.toString()
		})
		response.on('end', () => {
			console.log('No more data in response.')
			body = JSON.parse(body)
			//	console.log('body',body.tree)
			found = body.tree.filter(getContent);
			downloadFiles(found)
			//console.log('found',found)


		})
	})
	request.end()

}

const name = app.getName();
const version = app.getVersion()
const template = [
	{
		label: name,
		submenu: [
			{
				label: 'Update',
				click() {
					getGitUrls()
				},
			},
			{
				label: 'About ' + name + ' ' +version,
				role: 'about'
			},
			{
				label: 'Home ',
				click() {
					win.loadURL(_NUXT_URL_)
				}
			}
			
		]
	},
	{
		label: 'Views',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
	{
		role: 'window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'close' }
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click() { require('electron').shell.openExternal('https://electron.atom.io') }
			}
		]
	}
]
var kioskMode
let autoUpdateURL = `file://${__dirname}/version.html#v${app.getVersion()}`
/*
let autoUpdateURL = require('url').format({
	protocol: 'file',
	slashes: true,
	pathname: require('path').join(__dirname, '/version.html#v'+version)
})*/
config.dev ? kioskMode = false : kioskMode = true
/*
let updateUrl = require('url').format({
	protocol: 'file',
	slashes: true,
	pathname: require('path').join(__dirname, 'update.html')
})*/
let updateUrl = `file://${__dirname}/update.html#v${app.getVersion()}`
function sendStatusToWindow(text) {
	log.info(text);
	win.webContents.send('message', text);

}
const newWin = () => {
	win = new BrowserWindow({
		icon: path.join(__dirname, 'static/icon.png'),
		autoHideMenuBar: true,
		webPreferences: {
	
		},
		kiosk: kioskMode
	})
	//win.webContents.openDevTools();
	win.setBackgroundColor("#000000")
	win.setSize(1920,1080);
	let webContents = win.webContents;
	webContents.on('did-finish-load', () => {
		webContents.setZoomFactor(1);
		webContents.setVisualZoomLevelLimits(1, 1);
		webContents.setLayoutZoomLevelLimits(0, 0);
	});
	const menu = Menu.buildFromTemplate(template)
	//webFrame.setZoomLevelLimits(1, 1);
	Menu.setApplicationMenu(menu)
	//	win.maximize()
	win.on('closed', () => win = null)
	win.loadURL(updateUrl)
	if (config.dev) {
		// Install vue dev tool and open chrome dev tools
		const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
		installExtension(VUEJS_DEVTOOLS.id).then(name => {
			console.log(`Added Extension:  ${name}`)
			win.webContents.openDevTools()
		}).catch(err => console.log('An error occurred: ', err))
		// Wait for nuxt to build
		const pollServer = () => {
			http.get(_NUXT_URL_, (res) => {
				if (res.statusCode === 200) {   } else { setTimeout(pollServer, 300) }
			}).on('error', pollServer)
		}
		pollServer()
	} else { 
		
	//	return win.loadURL(updateUrl) 
		//return win.loadURL(_NUXT_URL_) 
	}
}
app.commandLine.appendSwitch('--force-gpu-rasterization')
app.commandLine.appendSwitch('--enable-accelerated-2d-canvas')
app.commandLine.appendSwitch('--enable-threaded-compositing')

//console.log(app.getGPUFeatureStatus(),'gpustat')

autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
	sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
	sendStatusToWindow('Update not available.');
	win.loadURL(_NUXT_URL_) 
})
autoUpdater.on('error', (err) => {
	sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
	sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
	sendStatusToWindow('Update downloaded');
});
app.on('ready', newWin)
app.on('ready', function () {
	sendStatusToWindow('Checking for updates...');
	autoUpdater.checkForUpdatesAndNotify();
});
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
