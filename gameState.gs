function intialSetting()
{
  setting = "Take inspiration from choose your own adventure books like Lone Wolf and ShadowRunners. Think of it as a text based version of the point and click Sierra games like King's Quest and Space Quest."
 var initialGameState = { "game": { "name": "New Game", "activeColumn": "3", "story":[{"role":"assistant","content":"The game is just starting, the narrator is asking what character and story we want to play."}],"summary":"The game is just starting, the narrator is asking what character and story we want to play.","scene":"Welcome, in this game you can adventure into any story and world. Who are we adventuring with today? What world setting are we exploring?","prompt":"","image":[]}}  
  Logger.log("Initial Game State: " + JSON.stringify(initialGameState))
  return initialGameState
}

// Gets the state of the game from the current sheet
function getGameState(sheet)
{
  gameJSON = sheet.getRange("B"+getrowStory()).getValue()
  return JSON.parse(gameJSON)
}
// Updates the state of the game to the current sheet
function postGameState(gameState, sheet)
{
  sheet.getRange("B"+getrowStory()).setValue(JSON.stringify(gameState))
}
