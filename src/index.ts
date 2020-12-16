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
    })
    window.setAspectRatio(16/9) // Windows サポートがまだ see: https://github.com/electron/electron/pull/26941
    window.loadURL("https://jk.nicovideo.jp")
    window.show()
})
