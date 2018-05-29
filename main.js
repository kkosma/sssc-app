/*
**  Nuxt
*/
const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
if (config.dev) {
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
const { app, Menu, BrowserWindow, webFrame } = require('electron')
const path = require('path')
//const app = electron.app

const template = [
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'pasteandmatchstyle' },
			{ role: 'delete' },
			{ role: 'selectall' }
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

const newWin = () => {
	win = new BrowserWindow({
		icon: path.join(__dirname, 'static/icon.png'),
		autoHideMenuBar: true,
		webPreferences: {
	
		},
		kiosk: true
	})
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
				if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
			}).on('error', pollServer)
		}
		pollServer()
	} else { return win.loadURL(_NUXT_URL_) }
}
app.commandLine.appendSwitch('--force-gpu-rasterization')
app.commandLine.appendSwitch('--enable-accelerated-2d-canvas')
app.commandLine.appendSwitch('--enable-threaded-compositing')

console.log(app.getGPUFeatureStatus(),'gpustat')
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
