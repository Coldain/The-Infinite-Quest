
function narratorAI(prompt,gameState,sheet,scriptProperties)
{
  // this will take input from the timelineAI and user input to generate the next scene
  postPrompt(prompt,gameState,sheet)
  gameState = timelineAI(gameState,sheet,scriptProperties)
  gameState = designerAI(prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
  // Get the hidden mechanics information
  gameState = mechanicsAI(prompt,gameState,sheet,scriptProperties)
  // Add the mechanic information to the prompt and push it to the narrator
  var narrator = []
  narrator.push({"role":"system","content":"You are a game master for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Focus on giving the player a chance for input. Use hidden skill checks, dice rolls, and have combat. The player can die and has limited inventory. "}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content":"Subsystem Input: " + gameState.game.mechanic + "\nUserInput: Here is what I'd like to do for the scene" + prompt + "\n Describe the next short scene in detail as if you were the narrator for a " +scriptProperties.getProperty("mode") +" letting me choose my next actions and reactions for the scene."})
  // Send the prompt with the hidden mechanics information
  Logger.log("NarratorAI")
  var description = sendPrompt(narrator,1.2,.4)
  gameState.game.activeColumn++  
  gameState.game.scene = description
  postDescription(description,gameState,sheet)
  postGameState(gameState,sheet)
  return designerAI(description,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
}

function mechanicsAI(prompt, gameState, sheet,scriptProperties)
{
  // gameState = plotAI(prompt,gameState,sheet)
  // gameState = inventoryAI(prompt,gameState,sheet)
  var mechanic = []
  mechanic.push({"role":"system","content":"You are a subsystem that tracks inventory, status, and rules for a " +scriptProperties.getProperty("mode") +" called" +gameState.game.name+". You will respond with details about inventory and suggests probabilites for the scene."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load past inventory details."}
                ,{"role": "assistant", "content": gameState.game.mechanic}
                // ,{"role": "user", "content": "Load my current plot and characters."}
                // ,{"role": "assistant", "content": gameState.game.plot}
                // ,{"role": "user", "content": "Load my current inventory and scene objects."}
                // ,{"role": "assistant", "content": gameState.game.inventory}
                ,{"role": "user", "content": "Please list out the inventory (with properties) and any objects of import in the scene. List a few probabilities of how things could go wrong or right based upon the players following actions. \nPlayer Input:" + prompt})
  Logger.log("mechanicsAI")
  var response = sendPrompt(mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  gameState.game.mechanic = response
  return gameState
}
function plotAI(prompt, gameState, sheet,scriptProperties)
{
  var plot = []
  plot.push({"role":"system","content":"You are a subsystem that tracks plot points and key characters for the " +scriptProperties.getProperty("mode") +" called" +gameState.game.name+". You'll track key plot details, see if anything has been added from the current scene interaction and suggest ways in which plots might develop by influencing the narrator."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load my current plot."}
                ,{"role": "assistant", "content": gameState.game.plot}
                ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +" Please update and list out important plot points / key characters and ways to develop them based upon the scene and the player's input.  \nPlayer Input:" + prompt})
  Logger.log("plotAI")
  var response = sendPrompt(plot,.7,-.2)
  postPlot(response,gameState,sheet)
  gameState.game.plot = response
  return gameState
}
function inventoryAI(prompt, gameState, sheet,scriptProperties)
{
  var inventory = []
  inventory.push({"role":"system","content":"You are a subsystem that tracks inventory for the " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". You'll track inventory, if it's the start of the game think of what might be a good starting inventory. You'll track items in the scene see if anything has been added. Keep responses focused on the items and objects."}
                ,{"role": "user", "content": "Load my story timeline so far."}
                ,{"role": "assistant", "content": gameState.game.summary}
                ,{"role": "user", "content": "Load my current scene."}
                ,{"role": "assistant", "content": gameState.game.scene}
                ,{"role": "user", "content": "Load my current plot."}
                ,{"role": "assistant", "content": gameState.game.inventory}
                ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +". Please update and list out important inventory and scene items important properties of the items and objects based upon the scene and the player's input. \nPlayer Input:" + prompt})
  Logger.log("InventoryAI")
  var response = sendPrompt(inventory,.7,-.2)
  postInventory(response,gameState,sheet)
  gameState.game.inventory = response
  return gameState
}

function designerAI(prompt,gameState,sheet,rowImage,rowDescription,scriptProperties)
{
  // var prompt = ""
  // var spreadsheet = SpreadsheetApp.getActive();
  //   spreadsheet.setActiveSheet(spreadsheet.getSheetByName("The Last City"), true);
  //   sheet = spreadsheet.getSheetByName("The Last City")
  // gameState = getGameState(sheet)
  // rowImage = getRowSceneImage()
  // rowDescription = getRowSceneImagery()
  var designer = []
  designer.push({"role":"system","content":"You are video game designer in charge of creating art for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Your job is is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
    ,{"role": "user", "content": "Load my story timeline so far."}
    ,{"role": "assistant", "content": gameState.game.summary}
    ,{"role": "user", "content": "Please create one description that can be used by AI (Dalle API) to generate an image. Destill the esences of the following scene into a single image and make it visually interesting. \nScene:" + prompt})
  Logger.log("DesignerAI")
  var description = sendPrompt(designer,.6,-.1,)
  // var description = ""
  sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
  try
  {
    var imageURL = sendDescription(description,scriptProperties)
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
  // var spreadsheet = SpreadsheetApp.getActive();
  //   spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Shadows of the Mind"), true);
  //   sheet = spreadsheet.getSheetByName("Shadows of the Mind")
  // gameState = getGameState(sheet)
  var scriptProperties = PropertiesService.getScriptProperties()
  const assistant = []
  assistant.push({"role":"system","content":"You are an assistant bot for a " +scriptProperties.getProperty("mode") +" narrator in " +gameState.game.name+". Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
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

function timelineAI(gameState,sheet,scriptProperties)
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

function styleTest(gameState, sheet,scriptProperties)
{
  // this will take input from the timelineAI and user input to generate the next scene
  sheet.getRange(getRowPlot(),2).setValue("Art Style")
  sheet.getRange(getRowInventory(),2).setValue("Game Type")
  postPrompt(gameState.game.prompt,gameState,sheet)
  postDescription(gameState.game.scene,gameState,sheet)

  // All the DOS Styles -----
  menuDOS()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the DOS Styles
  // All the SNES Styles -----
  menuSNES()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the SNES Styles
  // All the PS1 Styles -----
  menuPS1()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the PS1 Styles
  // All the Modern Styles -----
  menuModern()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the Moder Styles
  // All the Pixel Styles -----
  menuPixel()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the Pixel Styles
  // All the Ink Styles -----
  menuInk()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = designerAI(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = designerAI(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the Ink Styles


  return gameState
}