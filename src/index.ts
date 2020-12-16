import { app, BrowserWindow } from "electron"

app.on("ready", () => {
    const window = new BrowserWindow({
        transparent: true,
        hasShadow: false, // オンにしないと残像が残ることがある
        webPreferences: {
            // ✨ SECURITY
            enableRemoteModule: false,
            contextIsolation: true,
            // Enable DevTools
            devTools: true,
            // inject css
            preload: __dirname+"/preload.js",
            // disable monitor fullscreen
            disableHtmlFullscreenWindowResize: true,
        },
        width: 1280,
        height: 720,
        useContentSize: true,
    })
    window.webContents.session.webRequest.onBeforeRequest({urls: ["*://*/*"]}, (details, cb) => {
        const url = details.url
        if (!url.startsWith("https:")) {
            console.log(url)
            return cb({cancel: true})
        }
        const urlObj = new URL(url)
        if (urlObj.hostname.endsWith(".dmc.nico")) return cb({cancel: false})
        if (urlObj.hostname.endsWith(".nicovideo.jp")) return cb({cancel: false})
        if (urlObj.hostname.endsWith(".nimg.jp")) return cb({cancel: false})
        console.log(details)
        cb({cancel: true})
    })
    window.setAspectRatio(16/9) // Windows サポートがまだ see: https://github.com/electron/electron/pull/26941
    window.loadURL("https://jk.nicovideo.jp")
    window.show()
})
