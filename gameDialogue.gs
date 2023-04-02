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