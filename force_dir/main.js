const electron = require('electron')
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    //sync init con files
    var child = require('child_process').exec('bash ./src/updateics.sh', function (error, stdout, stderr) {  console.log('updated ics');  child.stdout.pipe(process.stdout);});
    //var execSync = require('exec-sync');
    //execSync('bash ./updateics.sh') ;
    //require('child_process').exec('python celulas.py', function (error, stdout, stderr) {    child.stdout.pipe(process.stdout);});


    // Create the browser window.
    mainWindow = new BrowserWindow({width:900, height: 800,resizable: false,resizable: true,title:'Dan Ellis 2016' });
    mainWindow.openDevTools();
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
