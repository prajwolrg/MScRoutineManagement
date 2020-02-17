const electron = require('electron');
const path = require('path');
const url = require('url');
process.env.NODE_ENV = 'development';
const { app, BrowserWindow, Menu, ipcMain } = electron;
const fs = require('fs');
const os = require('os');
const { shell, dialog } = require('electron') // deconstructing assignment
const dir_prefix_name = app.getAppPath();
const pdf_path = dir_prefix_name + "/pdf_dir/";
const word_path = dir_prefix_name + "/word_dir/";
let db = '';
let mainWindow;
let addWindow;
let Table_name = "";


app.on('window-all-closed', function () {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1000, height: 720, webPreferences: { nodeIntegration: true } });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'menu.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });

  /*
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
  */
});

// Handle add item window
function createWindow(TITLE, HTML_FILE) {
  addWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 720,
    title: TITLE,
    //titleBarStyle: 'default',
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.once('ready-to-show', () => {
    addWindow.show()
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, HTML_FILE),
    protocol: 'file:',
    slashes: true
  }));

  //const menu = new Menu();
  // Handle garbage collection

  addWindow.on('close', function () {
    addWindow = null;
  });
  return addWindow;
}


//EDIT FROM PRASHANT
//Button clicks handler.
//Every button in the program sends a "button clicked" event and ID as the parameter.
//some clicks might not have functionality.

ipcMain.on('buttonClicked', function (e, buttonId) {
  if (buttonId === "newRoutine") {
    createWindow("New Routine", "RoutineName.html");
    console.log('new routine');
    // mainWindow.webContents.send("dbName",db_name ,dir_prefix_name);
  }

  else if (buttonId == "oldRoutine") {
    createWindow("old Routine", "oldRoutine.html");
    console.log("update old routine");
  }

  else if (buttonId == "teacherRoutine") {
    createWindow("Teacher Routine", "teacherRoutine.html");
  }

  else if (buttonId == "editTeacher") {
    createWindow("Edit Teacher", "editTeacher.html");
    console.log('edit teacher');
  }

  else if (buttonId == "editCourse") {
    createWindow("Edit Course", "editSubject.html");
    console.log('edit course');
  }

  else if (buttonId == "addTeacher") {
    createWindow("Add Teacher", "addTeacher.html");
    console.log('add teacher');
  }

  else if (buttonId == "addCourse") {
    createWindow("Add Course", "addSubject.html");
    console.log('add course');
  }
  else if (buttonId == "addSupervisor") {
    createWindow("Add Supervisor", "addSupervisor.html");
  }
  else if (buttonId == "editSupervisor") {
    createWindow("Edit Supervisor", "Edit_supervisor.html");
  }
  else if (buttonId == "addProgram") {
    createWindow("Add Program", "addProgram.html");
  }
  else if (buttonId == "editProgram") {
    createWindow("Edit Program", "editProgram.html");
  }


  // else if(buttonId=="saveRoutine"){
  //   createWindow("Name of Routine", "databaseName.html");
  // }
});
// Catch item:add
ipcMain.on('Program:add', function (e, program_full_name, program_acronym) {
  mainWindow.webContents.send('Program:Store', program_full_name, program_acronym);
  console.log(`Name: ${program_full_name}   Initials: ${program_acronym}`);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Teacher:add', function (e, teacher_name, teacher_initials) {
  mainWindow.webContents.send('Teacher:Store', teacher_name, teacher_initials);
  console.log(`Name: ${teacher_name}   Initials: ${teacher_initials}`);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Supervisor:add', function (e, Supervisor_name, Supervisor_initials, Supervisor_position) {
  // console.log(Supervisor_name);
  // console.log(Supervisor_initials);
  // console.log(Supervisor_position);
  mainWindow.webContents.send('Supervisor:Store', Supervisor_name, Supervisor_initials, Supervisor_position);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Subject:add', function (e, Subject_name) {
  mainWindow.webContents.send('Subject:Store', Subject_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Database:add', function (e, item) {
  console.log(item);
  mainWindow.webContents.send('DataBase:Create', item);
  addWindow.close();
  createWindow("Students' Routine", "index.html");
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Routine:add', function (e, Routine_name, batch_yr, prog_full, prog_acr, year_rot, yr_part) {
  console.log(Routine_name);
  mainWindow.webContents.send('Routine:Create', Routine_name, batch_yr, prog_full, prog_acr, year_rot, yr_part);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Routine:old', function (e, Routine_name) {
  Table_name = Routine_name;
  console.log(Table_name);
  mainWindow.webContents.send('Routine:append', Table_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Routine:Teacher', function (e, teacher_name) {
  console.log(teacher_name);
  mainWindow.webContents.send('Routine:TeacherGen', teacher_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});




// pdf print function
//closing the window by "cancel" button.
ipcMain.on('closeWindow', function (e) {
  addWindow.close();
});

ipcMain.on('hideWindow', function (e) {
  addWindow.hide();
});

//Saves the pdf without any dailog.
ipcMain.on('print-to-pdf', (event, arg) => {
  routine_name_ext = arg + '.pdf'
  const pdfPath = path.join(pdf_path, routine_name_ext);
  mainWindow.webContents.printToPDF({
    pageSize: 'Letter'
  }).then(data => {
    fs.writeFileSync(pdfPath, data, (err) => {
      if (err) throw err
      console.log('PDF success!')
    })
  }
  )
});


// Receiving communication from index.html for new window creation and passing table_name info to main process..ie..app.js
ipcMain.on('print-to-Word', function (event, table_name) {
  Table_name = table_name;
  secondWindow = createWindow("Word", "printable.html");
});

//receiving communication from printable.html for quering Routine_name information

ipcMain.on('print-to-Word2', function (e) {
  console.log("yaay");
  console.log(Table_name);
  secondWindow.webContents.send('doc_name', Table_name);
});


ipcMain.on('print-to-pdf-word', (event, arg) => {
  routine_name_ext = arg + '(doc).pdf'
  const pdfPath = path.join(pdf_path, routine_name_ext);

  dialog.showSaveDialog({
    title: 'Save As',
    defaultPath: pdfPath,
    filters: [
    { name: 'Portable File Format', extensions: ['pdf'] },
  ]
  }).then(result => {
    if (!result.canceled) {
      secondWindow.webContents.printToPDF({
        pageSize: 'Letter'
      }).then(data => {
        fs.writeFileSync(result.filePath, data, (err) => {
          if (err) throw err
        })
      })
    }
  }).catch(e => { console.log(e) })


});

