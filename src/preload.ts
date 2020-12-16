addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style")
    style.innerHTML = `#root[data-browser-fullscreen] [class^="___player-display___"],[class^="___player-area___"][data-browser-fullscreen],#root[data-browser-fullscreen] [class^="___watch-page___"]{background:transparent!important} video{opacity:0}`
    style.dataset.type="electron-preload"
    document.body.appendChild(style)
    const csp = document.createElement("meta")
    csp.httpEquiv = "Content-Security-Policy"
    csp.content="default-src https://*.nicovideo.jp https://*.nimg.jp https://*.dmc.nico wss://*.nicovideo.jp blob:; style-src 'self' 'unsafe-inline' https://*.nimg.jp; img-src 'self' https://*.nimg.jp https://*.dmc.nico https://*.nicovideo.jp data:; script-src https://*.nimg.jp"
    document.head.appendChild(csp)
})
