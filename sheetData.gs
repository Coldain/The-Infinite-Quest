function getRowSceneImage()
{
  return 2
}
function getRowScene()
{
  return 3
}
function getRowPromptImage()
{
  return 4
}
function getRowPrompt()
{
  return 5
}
function getRowSuggestion()
{
  return 6
}
function getRowSceneImagery()
{
  return 7
}
function getRowPromptImagery()
{
  return 8
}
function getRowMechanic()
{
  return 9
}
function getRowPlot()
{
  return 10
}
function getRowInventory()
{
  return 11
}
function getRowSummary()
{
  return 12
}
function getRowGame()
{
  return 13
}


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
  return sheet.getRange(getRowScene(),gameState.game.activeColumn).getValue()
}

function postDescription(description,gameState,sheet)
{
  sheet.getRange(getRowScene(),gameState.game.activeColumn).setValue(description)
  return gameState
}

function postPrompt(prompt,gameState,sheet)
{
  sheet.getRange(getRowPrompt(),gameState.game.activeColumn).setValue(prompt)
}
function postSuggestion(prompt,gameState,sheet)
{
  sheet.getRange(getRowSuggestion(),gameState.game.activeColumn).setValue(prompt)
}
function postImagery(prompt,gameState,sheet)
{
  sheet.getRange(getRowImagery(),gameState.game.activeColumn).setValue(prompt)
}
function postMechanics(prompt,gameState,sheet)
{
  sheet.getRange(getRowMechanic(),gameState.game.activeColumn).setValue(prompt)
}
function postPlot(prompt,gameState,sheet)
{
  sheet.getRange(getRowPlot(),gameState.game.activeColumn).setValue(prompt)
}
function postInventory(prompt,gameState,sheet)
{
  sheet.getRange(getRowInventory(),gameState.game.activeColumn).setValue(prompt)
}
function postSummary(prompt,gameState,sheet)
{
  sheet.getRange(getRowSummary(),gameState.game.activeColumn).setValue(prompt)
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