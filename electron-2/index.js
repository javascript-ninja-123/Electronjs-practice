const electron = require('electron');
const {app,BrowserWindow, Menu,ipcMain} = electron;
let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit())
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu)
});

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add new Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('todoAdd', (e,todo) => {
  mainWindow.webContents.send('todoAdd',todo)
  addWindow.close();
})

const deleteTodo = () => {
  mainWindow.webContents.send('deleteTodo','')
}


const menuTemplate = [
  {
    label:'File',
    submenu: [
     {
       label: 'New todo',
       accelerator:process.platform === 'darwin' ? 'Command+A' : 'Ctrl+A',
       click(){createAddWindow();}
     },
     {
       label: 'Clear todo',
       accelerator:process.platform === 'darwin' ? 'Command+Alt+D' : 'Ctrl+Alt+D',
       click(){deleteTodo()}
     },
     {
       label:'Quit',
       accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
       click () {
         app.quit();
       }
     },
     {role: 'minimize'},
   ]
  }
];

if(process.platform === 'darwin'){
  menuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label:'DEVELOPER!!!!',
    submenu:[
      {
        label: 'Toggle developer tool',
        accelerator: process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
        click(item,focusedWindow){
            focusedWindow.toggleDevTools();
        }
      },
      {role: 'reload'},
      {role: 'forcereload'},
    ]
  })
}
