import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    title: '9TD — Task Dashboard'
  })

  const devUrl = 'http://localhost:5173'
  const prodUrl = new URL('../dist/index.html', import.meta.url).toString()

  if (process.env.VITE_DEV_SERVER_URL || process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devUrl)
  } else {
    mainWindow.loadURL(prodUrl)
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
