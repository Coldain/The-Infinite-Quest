function intialSetting(gameName)
{
  setting = ""
 var initialGameState = { "game": { "name": gameName, "activeColumn": "3"}}  
  Logger.log("Initial Game State: " + JSON.stringify(initialGameState, null, 5))
  return initialGameState
}

// Gets the state of the game from the current sheet
function getGameState(sheet)
{
  Logger.log(sheet.getSheetName())
  const gameJSON = sheet.getRange("B"+getRowGame()).getValue()
  return JSON.parse(gameJSON)
}
// Updates the state of the game to the current sheet
function postGameState(gameState)
{ 
  Logger.log("Updating Game State")
  const sheet = SpreadsheetApp.getActive().getSheetByName(gameState.game.name)
  sheet.getRange("B"+getRowGame()).setValue(JSON.stringify(gameState, null, 5))
}

