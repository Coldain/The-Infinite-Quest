function downloadFile(imageURL) {  
  var fileName = "";
  var fileSize = 0;

  var response = UrlFetchApp.fetch(imageURL, {muteHttpExceptions: true});
  var rc = response.getResponseCode();

  if (rc == 200) {
    var fileBlob = response.getBlob()
    var folder = DriveApp.getFolderById("1tdIiAvwtTeS-y5ev1m-A4Aocc-JayFNh");
    Logger.log(folder.getId() + " " + folder.getName() + " " + folder.getUrl())
    if (folder != null) {
      var file = folder.createFile(fileBlob);
      fileName = file.getName();
      fileSize = file.getSize();
    }
  }

  var fileInfo = { "rc":rc, "fileName":fileName, "fileSize":fileSize };
  Logger.log(fileInfo)
  return file.getId();
}

function getSheets() {
  try {
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    var names = [];
    for( var i=0; i<sheets.length; i++ ) {
      names.push(sheets[i].getName());
    }
    return names;
  }
  catch(err) {
    Logger.log(err);
  }
}

function changeSheet(name) {
  try {
    var spread = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spread.getSheetByName(name);
    SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(sheet);
  }
  catch(err) {
    Logger.log(err);
  }
}
function loadSheet() {
  try {
    var output = HtmlService.createHtmlOutputFromFile('selectSheet');
    SpreadsheetApp.getUi().showSidebar(output);
  }
  catch(err) {
    Logger.log(err);
  }
}

function getDescription(gameState,sheet)
{
  return sheet.getRange(3,gameState.game.activeColumn).getValue()
}

function postDescription(description,gameState,sheet)
{
  sheet.getRange(3,gameState.game.activeColumn).setValue(description)
  return gameState
}

function postPrompt(prompt,gameState,sheet)
{
  sheet.getRange(5,gameState.game.activeColumn).setValue(prompt)
}
function postSuggestion(prompt,gameState,sheet)
{
  sheet.getRange(6,gameState.game.activeColumn).setValue(prompt)
}


function getMessages(activeColumn, sheet)
{
    var spreadsheet = SpreadsheetApp.getActive();
    var sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Current Game'), true);
    var gameState = JSON.parse(sheet.getRange("B7").getValue())
    var text = "banana alkjkljkljslkdg"
    var messages = JSON.parse(sheet.getRange(8,gameState.game.activeColumn).getValue())
    messages.push({"role": "user", "content": text})
}