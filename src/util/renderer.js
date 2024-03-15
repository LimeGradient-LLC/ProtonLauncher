const {ipcRenderer} = require('electron')

function login() {
    ipcRenderer.invoke("login");
    console.log('Logging in...')
}

ipcRenderer.on("setSkin", async (event, profileId) => {
    document.querySelector(".loginButton").style.visibility = "hidden"
    const skinImg = document.createElement("img")
    skinImg.width = 100
    skinImg.height = 100
    skinImg.id = "skinHead"

    document.querySelector(".accountHolder").appendChild(skinImg)
    document.getElementById('skinHead').src = `https://mc-heads.net/avatar/${profileId}`
})

ipcRenderer.on("loggingIn", (event, loginCode) => {
    if (loginCode === 0) {
        document.querySelector(".loginButton").disabled = false
        console.log("Failed to log in")
    }
    if (loginCode === 1) {
        document.querySelector(".loginButton").disabled = true
            console.log("Attempting to log in")
    }
})