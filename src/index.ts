import { app, BrowserWindow, dialog, Menu, MenuItem, shell } from "electron"

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
            if (url.startsWith("http:")) {
                console.log("upgrade to https", url)
                return cb({redirectURL: url.replace("http:", "https:")})
            }
            console.log("unknown", url)
            return cb({cancel: true})
        }
        const urlObj = new URL(url)
        if (urlObj.hostname.endsWith(".dmc.nico")) return cb({cancel: false})
        if (urlObj.hostname.endsWith(".nicovideo.jp")) return cb({cancel: false})
        if (urlObj.hostname.endsWith(".nimg.jp")) return cb({cancel: false})
        if (urlObj.hostname.endsWith(".simg.jp")) return cb({cancel: false})
        console.log("blocked", details)
        cb({cancel: true})
    })
    const menu = new Menu()
    menu.append(new MenuItem({label: "常に前面に表示", type: "checkbox", click(item) {
        window.setAlwaysOnTop(item.checked)
    }}))
    menu.append(new MenuItem({label: "jk.nicovideo.jpに戻る", click() {
        window.loadURL("https://jk.nicovideo.jp")
    }}))
    async function confirm(type: "question", message: string, detail: string, okMessage: string) {
        const res = await dialog.showMessageBox(window, {
            type: "question",
            message,
            detail,
            // TODO: Windows 環境に順番を合わせる
            buttons: [okMessage, "キャンセル"],
            defaultId: 0,
            cancelId: 1,
        })
        return res.response === 0
    }
    window.webContents.on("new-window", (event, url) => {
        event.preventDefault()
        if (url.startsWith("http:") || url.startsWith("https:")) {
            confirm(
                "question",
                "次のURLをブラウザで開きますか？",
                url,
                "開く"
            ).then(result => {
                if (result) {
                    shell.openExternal(url)
                }
            })
        }
    })
    window.webContents.on("context-menu", (event) => {
        menu.popup({window})
    })
    window.webContents.on("will-navigate", (event, url) => {
        if (!url.startsWith("http:") && !url.startsWith("https:")) {
            event.preventDefault()
            return
        }
        const urlObj = new URL(url)
        const navigateAllowed = [
            "live.nicovideo.jp",
            "live2.nicovideo.jp",
            "jk.nicovideo.jp",
            "account.nicovideo.jp",
            "premium.nicovideo.jp",
        ]
        if (!navigateAllowed.includes(urlObj.hostname)) {
            event.preventDefault()
            confirm(
                "question",
                "次のURLをブラウザで開きますか？",
                url,
                "開く"
            ).then(result => {
                if (result) {
                    shell.openExternal(url)
                }
            })
            return
        }
    })
    window.setAspectRatio(16/9) // Windows サポートがまだ see: https://github.com/electron/electron/pull/26941
    window.loadURL("https://jk.nicovideo.jp")
    window.show()
})
