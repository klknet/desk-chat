'use strict'

import {app, BrowserWindow, ipcMain} from 'electron'
import client from './connection'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let win={}
// let mainWindow
let winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

// winURL = `file://src/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    win.loginWin = new BrowserWindow({
        height: 350,
        useContentSize: true,
        width: 250,
        autoHideMenuBar: true,
        backgroundColor:'#F5F5F5'
    })

    win.loginWin.loadURL(winURL)

    win.loginWin.on('closed', () => {
        win.loginWin = null
        if(!win.mainWin)
            client.close()
    })
    client.init()

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win.loginWin === null) {
        createWindow()
    }
})

ipcMain.on('index-show', function () {
    win.loginWin.webContents.send('close-login-win')
    //这个宽高度就是微信的宽度和高度850，580
    win.mainWin = new BrowserWindow({width:850, height: 580, autoHideMenuBar: true, frame:false})
    let indexWin = win.mainWin
    indexWin.setMinimumSize(720,500)
    indexWin.setTitle('')
    indexWin.loadURL(winURL)
    indexWin.webContents.openDevTools()
    indexWin.on('closed', () => {
        client.close()
        win.mainWin = null
    })

})

global.sharedObject = {
    client
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
