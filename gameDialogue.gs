function getPersonas() {
  return personas;
}

function setGameType(gameType) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("gameType", gameType);
}


function showDialogue() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('gameDialogue_UI.html')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Text RPG');
}

function loadGameByName(gameName) {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(gameName);
  
  if (sheet) {
    sheet.showSheet();
    spreadsheet.setActiveSheet(sheet, true);
    // Call menuPlay or any other function necessary to start the game
    menuPlay();
  }
}

function getGameList() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var gameList = [];
  
  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    if (sheetName !== 'New Game') {
      gameList.push(sheetName);
    }
  });

  return gameList;
}
