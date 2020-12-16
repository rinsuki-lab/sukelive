addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style")
    style.innerHTML = `#root[data-browser-fullscreen="parent"] [class^="___player-display___"],[class^="___player-area___"][data-browser-fullscreen="parent"],#root[data-browser-fullscreen="parent"] [class^="___watch-page___"]{background:transparent!important} video{opacity:0}`
    style.dataset.type="electron-preload"
    document.body.appendChild(style)
})
