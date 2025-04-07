import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import exec, { ChildProcess } from "child_process"
import { ollamaServe } from "./shellCommands.js";

async function main(): Promise<ChildProcess> {

    // try to start the ollama server
    const childProcess = exec.exec(ollamaServe, (err, stdout, stderr) => {

        if(stderr.length){
            if(stderr.includes("already in use")){
                console.log("ollama already running.")
            }
            else{
                console.error(err)
            }
        }
        else{
            console.log("ollama started.")

            process.on('SIGINT', () => {
                console.log('Received SIGINT');
                cleanup();
                process.exit();
              });
              
              process.on('SIGTERM', () => {
                console.log('Received SIGTERM');
                cleanup();
                process.exit();
              });
              
              process.on('exit', (code) => {
                console.log(`Process exiting with code ${code}`);
                cleanup();
              });
        }
        
    })

    return childProcess;

    function cleanup() {

        if(childProcess){
            console.log("cleaning up the child process")
            childProcess.kill("SIGTERM")
        }

    }

}


app.on("ready", () => {

    const mainWindow = new BrowserWindow({
        webPreferences: {
            devTools: true
        },
        autoHideMenuBar: true,
        title: "AI",
        transparent: true
    });

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
            event.preventDefault()
        }
    })

    const childProcess = main()


    if(isDev()) {
        mainWindow.loadURL("http://localhost:5123")
        console.log("Development environment.")
    }
    else{
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
        console.log("Production environment.")
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            console.log("closed.")
            
            childProcess.then((c) => {
                if(c){
                    c.kill("SIGTERM")
                }
            })

            app.quit()
        }
    })

})