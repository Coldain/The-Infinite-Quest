
function narratorAI(prompt,gameState,sheet)
{
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = timelineAI(gameState,sheet)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery())
  // Get the hidden mechanics information
  gameState = mechanicsAI(prompt,gameState,sheet)
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

function mechanicsAI(prompt, gameState, sheet)
{
  gameState = plotAI(prompt,gameState,sheet)
  gameState = inventoryAI(prompt,gameState,sheet)
  var mechanic = []
  mechanic.push({"role":"system","content":"You are a subsystem that tracks inventory, status, plot, and rules for a text based role playing game. You will respond with details about inventory and probability and anything that may influence the narrator. The player should not know about you, your responses will be given to chatGPT API as along with the user input to create a story for " +gameState.game.name+". You have a fun but secret role."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load my current plot and characters."}
                ,{"role": "assistant", "content": gameState.game.plot}
                ,{"role": "user", "content": "Load my current inventory and scene objects."}
                ,{"role": "assistant", "content": gameState.game.inventory}
                ,{"role": "user", "content": "I'm the narrator for a text-based RPG! What inventory, objects in the scene, character details, and plot point should I be aware of and any probabilities you think would make the story more engaging? This is what the user responded with. \nPlayer Input:" + prompt})
  Logger.log("mechanicsAI")
  var response = sendPrompt(mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  gameState.game.mechanic = response
  return gameState
}
function plotAI(prompt, gameState, sheet)
{
  var plot = []
  plot.push({"role":"system","content":"You are a subsystem that tracks plot points and key characters for the text-based role playing game called" +gameState.game.name+". You'll track key plot details, see if anything has been added from the current scene interaction and suggest ways in which plots might develop by influencing the narrator."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load my current plot."}
                ,{"role": "assistant", "content": gameState.game.plot}
                ,{"role": "user", "content": "I'm the narrator for a text-based RPG! Please update and list out important plot points / key characters and ways to develop them based upon the scene and the player's input.  \nPlayer Input:" + prompt})
  Logger.log("plotAI")
  var response = sendPrompt(plot,.7,-.2)
  postPlot(response,gameState,sheet)
  gameState.game.plot = response
  return gameState
}
function inventoryAI(prompt, gameState, sheet)
{
  var inventory = []
  inventory.push({"role":"system","content":"You are a subsystem that tracks inventory for the text-based role playing game called" +gameState.game.name+". You'll track inventory, if it's the start of the game think of what might be a good starting inventory. You'll track items in the scene see if anything has been added. Keep responses focused on the items and objects."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load my current plot."}
                ,{"role": "assistant", "content": gameState.game.inventory}
                ,{"role": "user", "content": "I'm the narrator for a text-based RPG! Please update and list out important inventory and scene items important properties of the items and objects based upon the scene and the player's input. \nPlayer Input:" + prompt})
  Logger.log("InventoryAI")
  var response = sendPrompt(inventory,.7,-.2)
  postInventory(response,gameState,sheet)
  gameState.game.inventory = response
  return gameState
}

function designerAI(prompt,gameState,sheet,rowImage,rowDescription)
{
  // var prompt = ""
  // var spreadsheet = SpreadsheetApp.getActive();
  //   spreadsheet.setActiveSheet(spreadsheet.getSheetByName("The Last City"), true);
  //   sheet = spreadsheet.getSheetByName("The Last City")
  // gameState = getGameState(sheet)
  // rowImage = getRowSceneImage()
  // rowDescription = getRowSceneImagery()
  var designer = []
  designer.push({"role":"system","content":"You are video game designer in charge of creating art for a text-based rpg called " +gameState.game.name+". Your job is is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
    ,{"role": "user", "content": "Load my story timeline so far."}
    ,{"role": "assistant", "content": gameState.game.summary}
    ,{"role": "user", "content": "Please create one description that can be used by AI (Dalle API) to generate an image. Destill the esences of the following scene into a single image and make it visually interesting. \nScene:" + prompt})
  Logger.log("DesignerAI")
  var description = sendPrompt(designer,.6,-.1)
  // var description = ""
  sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
  try
  {
    var imageURL = sendDescription(description)
    var fileID = downloadFile(imageURL)
    var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
    sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
  }
  catch
  {
    Logger.log("Promblem with image.")
    sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
  }
  return gameState
}

function assistAI(gameState,sheet)
{
  var spreadsheet = SpreadsheetApp.getActive();
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Shadows of the Mind"), true);
    sheet = spreadsheet.getSheetByName("Shadows of the Mind")
  gameState = getGameState(sheet)
  const assistant = []
  assistant.push({"role":"system","content":"You are an assistant bot for a text-based RPG narrator in " +gameState.game.name+". Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
                  ,{"role": "user", "content": "Load my story timeline so far."}
                  ,{"role": "assistant", "content": gameState.game.summary}
                  ,{"role": "user", "content": "Load my current scene."}
                  ,{"role": "assistant", "content": gameState.game.scene}
                  ,{"role": "user", "content": "Load my current mechanic."}
                  ,{"role": "assistant", "content": gameState.game.mechanic}
                  ,{"role": "user", "content": "I'm asking you for suggestions on what I can do next. Maybe 2 somewhat obvious and 2 really creative options Have the options be related to the character, story and specific scene."})
  Logger.log("AssistAI")
  var suggestion = sendPrompt(assistant,1.2,.4)
  postSuggestion(suggestion,gameState,sheet)
}

function timelineAI(gameState,sheet)
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