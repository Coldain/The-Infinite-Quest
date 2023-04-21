function narratorAIClassic(prompt,gameState,sheet)
{
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = timelineAIClassic(gameState,sheet)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery())
  // Get the hidden mechanics information
  gameState = mechanicsAIClassic(prompt,gameState,sheet)
  // Add the mechanic information to the prompt and push it to the narrator
  var narrator = []
  narrator.push({"role":"system","content":"You are a game master for a text-based style role playing game called " +gameState.game.name+". Focus on giving the player a chance for input. Use skill checks, dice rolls, and have combat. The player can die and has limited inventory. "}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content":"Subsystem Input: " + gameState.game.mechanic + "\nUserInput: Here is what I'd like to do for the scene" + prompt + "\n Describe the next short scene in detail as if you were the narrator for a text-based RPG letting me choose my next actions and reactions for the scene."})
  // Send the prompt with the hidden mechanics information
  Logger.log("NarratorAI")
  var description = sendPrompt(narrator,1.2,.4)
  gameState.game.activeColumn++  
  gameState.game.scene = description
  postDescription(description,gameState,sheet)
  postGameState(gameState,sheet)
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery())
}

function timelineAIClassic(gameState,sheet)
{
  // Check gameState story length,
  const timeline = []
  timeline.push({"role":"system","content":"You are the timeline bot. Your job is to track and the timeline of the story so far in " +gameState.game.name+". You will be used to generate the timeline that the other bots will use to craft the next scene."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Please provide a short timeline of my story events so far. With a brief summary of the story setting."})
  Logger.log("TimelineAI")
  gameState.game.summary = sendPrompt(timeline,1.2,.4)
  postGameState(gameState,sheet)
  postSummary(gameState.game.summary,gameState,sheet)
  return gameState
}

function mechanicsAIClassic(prompt, gameState, sheet)
{
  gameState = plotAI(prompt,gameState,sheet)
  gameState = inventoryAI(prompt,gameState,sheet)
  // gameState = plotAI(prompt,gameState,sheet)
  // gameState = inventoryAI(prompt,gameState,sheet)
  var mechanic = []
  mechanic.push({"role":"system","content":"You are a subsystem that tracks inventory, status, and rules for a text based role playing game " +gameState.game.name+". You will respond with details about inventory and suggests probabilites for the scene."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Please list out the inventory (with properties) and any objects of import in the scene. List a few probabilities of how things could go wrong or right based upon the players following actions. \nPlayer Input:" + prompt})
  Logger.log("mechanicsAI")
  var response = sendPrompt(mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  gameState.game.mechanic = response
  return gameState
}