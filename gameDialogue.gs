function showDialogue() {
  var template = HtmlService.createTemplateFromFile('gameDialogue_UI.html');
  var htmlOutput = template.evaluate()
    .setWidth(900)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Persona Bot");
}


function processResponse(responseText) {
  if (responseText.length > 0) {
    var sheet = SpreadsheetApp.getActiveSheet()
    var gameState = getGameState(sheet)
    Logger.log("User Input: " + responseText)
    gameState.game.prompt = responseText
    const persona = getSelectedPersona()
    gameState = narratorAI(responseText, gameState, sheet, persona)
    postGameState(gameState,sheet)
    menuPlay(); // Continue with the menuPlay function
  } else {
    // User clicked "Cancel" or closed the dialog
    ui.alert("We can continue later. Feel free to explore your timeline! ⏳ Don't forget to have an adventure in the real world.🕺🏼");
  }
}

function getGameStateHTML() {
  var sheet = SpreadsheetApp.getActiveSheet();
  Logger.log(sheet.getSheetName());
  var gameState = getGameState(sheet);
  var persona = getSelectedPersona();
  return {gameState: gameState, sheet: sheet, persona: persona};
}

function htmlLogger(text){
  Logger.log(text);
}


function propmtHTML(text) {
  Logger.log("propmtHTML: Received text:", text); 
  console.log("propmtHTML: Received text:", text); 
  var html = getGameStateHTML();
  html.gameState.game.prompt = text;
  postGameState(html.gameState);
  sheet.getRange(html.gameState.game.activeRow, html.gameState.game.activeColumn).setValue(text);
  
  // Return the updated game state

  Logger.log("propmtHTML: Returning updated HTML:", html); 
  console.log("propmtHTML: Returning updated HTML:", html); 
  return html;
}
