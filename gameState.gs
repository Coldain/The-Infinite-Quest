function intialSetting(gameName)
{
  setting = "Take inspiration from choose your own adventure books like Lone Wolf and ShadowRunners. Think of it as a text based version of the point and click Sierra games like King's Quest and Space Quest."
 var initialGameState = { "game": { "name": gameName, "activeColumn": "3","story":[{"role":"assistant","content":"Game just started, rely on the users prompt to create a timeline before this point."}],"summary":"The game is just starting, the narrator is asking what character and story we want to play.","scene":"Welcome, in this game you can adventure into any story and world. Who is adventuring today? What world setting are we exploring?","plot":"this is undecided as we're just begining refer to the users prompt","characters":"","mechanic":"The game has just begun refer to the users prompt","inventory":"","prompt":"","images":[["system","https://drive.google.com/uc?export=download&id=1pCYe6uaJfJ8EBvno8qE71K2a8jX5Z26h","Welcome"]]}}  
  Logger.log("Initial Game State: " + JSON.stringify(initialGameState))
  return initialGameState
}

// Gets the state of the game from the current sheet
function getGameState(sheet)
{
  gameJSON = sheet.getRange("B"+getRowGame()).getValue()
  return JSON.parse(gameJSON)
}
// Updates the state of the game to the current sheet
function postGameState(gameState)
{ 
  Logger.log("Updating Game State")
  const sheet = SpreadsheetApp.getActive().getSheetByName(gameState.game.name)
  sheet.getRange("B"+getRowGame()).setValue(JSON.stringify(gameState))
}

