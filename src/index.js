const {app, BrowserWindow, ipcMain} = require('electron')

const path = require("path")

const auth = require('./mc/auth')

const window = {
    win: null,
    get get() {
        return this.win
    },
    set set(newWin) {
        this.win = newWin
    }
}

const token = {
    token: null,
    get get() {
        return this.token
    },
    set set(newToken) {
        this.token = newToken
    }
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Proton Launcher",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.set = win
    win.loadFile('src/index.html')
}

app.whenReady().then(() => {
    createWindow()
    auth.checkLogin()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    ipcMain.handle("login", async(event) => {
        auth.login()
    })
})

exports.window = window
exports.token = token