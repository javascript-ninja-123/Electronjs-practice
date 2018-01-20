const electron = require('electron')
const { app, BrowserWindow ,ipcMain} = electron;
let mainWindow;
const ffmpeg = require('fluent-ffmpeg')

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`)

})


ipcMain.on('videoSubmit', (e,path) => {
  ffmpeg.ffprobe(path, (err, metadata) =>  {
    mainWindow.webContents.send('durationSubmit', metadata.format.duration);
  });
})
