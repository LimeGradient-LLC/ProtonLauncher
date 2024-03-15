const {Auth} = require('msmc')

const path = require('path')
const fs = require('fs')

const win = require("../index")

const appdataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + "/.local/share")

const mc_data = {
    data: [],
    java: null
}

async function checkLogin() {
    win.window.get.webContents.send("loggingIn", 1)

    fs.readFile(path.join(appdataPath, "protonlauncher/mc.json"), async (err, file) => {
        if (err) {
            console.log("No MC Token Found")
            win.window.get.webContents.send("loggingIn", 0)
            return
        }
        if (file.length == 0) {
            console.log("mc.json empty")
            win.window.get.webContents.send("loggingIn", 0)
            return
        } else {
            console.log("Attempting to Log In")
            const json_data = JSON.parse(file)
            const authManager = new Auth("login")
            authManager.refresh(json_data.data[0].token).then(async xboxManager => {
                const xbx = await xboxManager.getMinecraft()
                win.token.set = await xboxManager.getMinecraft()
                win.window.get.webContents.send("setSkin", xbx.profile.id)
            })
        }
    })
}

async function login() {
    win.window.get.webContents.send("loggingIn", 1)

    if (!fs.existsSync(path.join(appdataPath, "protonlauncher")))
        fs.mkdirSync(path.join(appdataPath, "protonlauncher"))
    if (!fs.existsSync(path.join(appdataPath, "protonlauncer/mc.json")))
        fs.writeFileSync(path.join(appdataPath, "protonlauncher/mc.json"), "", err => {
            if (err) throw err;
    })

    const authManager = new Auth("select_account")
    authManager.launch("raw").then(async xboxManager => {
        const xbx = await xboxManager.getMinecraft();
        mc_data.data.push({token: xboxManager.msToken, id: xbx.profile.id})
        win.token.set = await xboxManager.getMinecraft()
        fs.writeFileSync(path.join(appdataPath, "protonlauncher/mc.json"), JSON.stringify(mc_data), (err) => {if (err) throw err})
        win.window.get.webContents.send("setSkin", xbx.profile.id)
    })

    console.log(appdataPath)
}

exports.login = login
exports.checkLogin = checkLogin
exports.mc_data = mc_data