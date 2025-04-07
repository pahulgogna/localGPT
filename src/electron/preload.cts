import electron  from "electron";

electron.contextBridge.exposeInMainWorld("electron", {
})