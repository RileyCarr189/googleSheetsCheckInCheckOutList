function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function getNames() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Names');
  const names = sheet.getRange('A:A').getValues().flat().filter(String).sort();
  return names;
}

function initializeLogSheet() {
  const logSheet = getOrCreateLogSheet();
  const names = getNames();
  
  // Only clear and add names if the log sheet is empty
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['Name', 'Time', 'Status']);
    names.forEach(name => {
      logSheet.appendRow([name, '', '']);
    });
  }
}

function checkIn(name) {
  const logSheet = getOrCreateLogSheet();
  const time = new Date();
  
  // Check if the name is already checked in
  const existingEntries = logSheet.getRange('A:C').getValues();
  const isCheckedIn = existingEntries.some(row => row[0] === name && row[2] === "Checked In");
  
  if (isCheckedIn) {
    throw new Error(name + " is already checked in.");
  } else {
    logSheet.appendRow([name, time, "Checked In"]);
  }
}

function checkOut(name) {
  const logSheet = getOrCreateLogSheet();
  const time = new Date();
  
  // Check if the name is already checked out
  const existingEntries = logSheet.getRange('A:C').getValues();
  const isCheckedOut = existingEntries.some(row => row[0] === name && row[2] === "Checked Out");
  
  if (isCheckedOut) {
    throw new Error(name + " is already checked out.");
  } else {
    logSheet.appendRow([name, time, "Checked Out"]);
  }
}

function addName(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Names');
  const existingNames = sheet.getRange('A:A').getValues().flat().filter(String);
  
  // Check for duplicate names
  if (existingNames.includes(name)) {
    throw new Error(name + " already exists.");
  } else {
    sheet.appendRow([name]);
  }
}

function getOrCreateLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName('Log');
  if (!logSheet) {
    logSheet = ss.insertSheet('Log');
    logSheet.appendRow(['Name', 'Time', 'Status']);
  }
  return logSheet;
}
