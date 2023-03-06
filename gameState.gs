function intialSetting()
{
  setting = "Take inspiration from choose your own adventure books like Lone Wolf and ShadowRunners. Think of it as a text based version of the point and click Sierra games like King's Quest and Space Quest."
 var initialGameState = { "game": { "name": "New Game", "activeColumn": "3", "narrator":[{"role":"system","content":"You are a game master for a text-based style role playing game. Leading the user through the game, you are able to describe the environment and the user's interactions. Take it one scene at a time but hint at overarching ideas and characters." + setting + " Use skill checks, dice rolls, and have combat. The player can die and has limited inventory. It's also okay to tell them what they attempt doesn't work but in a way that still progresses the story."},{"role":"assistant","content":"Welcome, in this game you can adventure into any story and world. Who are we adventuring with today? What world setting are we exploring?"}], "mechanic":[{"role":"system","content":"Do not reference or respond to the user directly. You are a subsystem that tracks inventory, status, and rules for a text based rpg. You will respond with details about inventory and probability and anything that may influence the narrator. The player should not know about you, your responses will be given to chatGPT API as along with the user input to create a story. You have a fun but secret role."}],"designer":[{"role":"system","content":"You are video game designer in charge of creating art for a text-based rpg. Your job is is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}],"image":[]}, "character": { "name": "" } }  
  Logger.log("Intial Game State: " + JSON.stringify(initialGameState))
  return initialGameState
}

// Gets the state of the game from the current sheet
function getGameState(sheet)
{
  gameJSON = sheet.getRange("B7").getValue()
  return JSON.parse(gameJSON)
}
// Updates the state of the game to the current sheet
function postGameState(gameState, sheet)
{
  sheet.getRange("B7").setValue(JSON.stringify(gameState))
}
