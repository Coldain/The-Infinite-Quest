
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
  narrator.push({"role":"system","content":"You are a game master for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Focus on giving the player a chance for input. Use hidden skill checks, dice rolls, and have combat. The player can die and has limited inventory."}
                ,{"role": "user", "content": "Load my story, scene, and game mechanics details."}
                ,{"role": "assistant", "content": "Story: " + gameState.game.summary + "\nScene: " + gameState.game.scene + "\nMechanic: " + gameState.game.mechanic}
                ,{"role": "user", "content":"Describe the next short scene in detail as if you were the narrator for a " +scriptProperties.getProperty("mode") +" letting me choose my next actions and reactions for the scene. User Input: " + prompt})
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
  var mechanic = []
  mechanic.push({"role":"system","content":"You are a subsystem that tracks inventory, status, and rules for a " +scriptProperties.getProperty("mode") +" called" +gameState.game.name+". You will respond with details about inventory and suggests probabilities for the scene."}
                ,{"role": "user", "content": "Load my story, scene, and game mechanics details."}
                ,{"role": "assistant", "content": "Story: " + gameState.game.summary + "\nScene: " + gameState.game.scene + "\nMechanic: " + gameState.game.mechanic}
                ,{"role": "user", "content": "Please list out the inventory (with properties) and any objects of import in the scene. List a few probabilities of how things could go wrong or right based upon the players following actions. Player Input: " + prompt})
  Logger.log("mechanicsAI")
  var response = sendPrompt(mechanic,.7,-.2)
  postMechanics(response,gameState,sheet)
  gameState.game.mechanic = response
  return gameState
}

// 

function designerAI(prompt,gameState,sheet,rowImage,rowDescription,scriptProperties,skipPaint)
{
  var designer = []
  designer.push({"role":"system","content":"You are video game designer in charge of creating art for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Your job is is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
    ,{"role": "user", "content": "Load my story timeline so far."}
    ,{"role": "assistant", "content": gameState.game.summary}
    ,{"role": "user", "content": "Please create one description that can be used by AI (Dalle API) to generate an image. Destill the esences of the following scene into a single image and make it visually interesting. \nScene:" + prompt})
  Logger.log("DesignerAI")
  var description = sendPrompt(designer,.6,-.1,)
  // var description = ""
  if (skipPaint != 1 )
  {
    sheet.getRange(rowDescription,gameState.game.activeColumn).setValue(description)
    try
    {
      var imageURL = sendDescription(description,scriptProperties,gameState)
      var fileID = downloadFile(imageURL)
      var inlineURL = "https://drive.google.com/uc?export=download&id="+fileID
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue('=IMAGE("'+inlineURL+'")')
    }
    catch
    {
      Logger.log("Promblem with image.")
      sheet.getRange(rowImage,gameState.game.activeColumn).setValue("Promblem with image.")
    }
  }
  else
  {
    return description
  }

  return gameState
}

function timelineAI(gameState,sheet,scriptProperties)
{
  // Check gameState story length,
  const timeline = []
  timeline.push({"role":"system","content":"You are the timeline bot. Your job is to track and the timeline of the story so far in " +gameState.game.name+". You will be used to generate the timeline that the other bots will use to craft the next scene."}
                ,{"role": "user", "content": "Load my story, scene, and game mechanics details."}
                ,{"role": "assistant", "content": "Story: " + gameState.game.summary + "\nScene: " + gameState.game.scene}
                ,{"role": "user", "content": "Please provide a short timeline of my story events so far. With a brief summary of the story setting."})
  Logger.log("TimelineAI")
  gameState.game.summary = sendPrompt(timeline,1.2,.4)
  postGameState(gameState,sheet)
  postSummary(gameState.game.summary,gameState,sheet)
  return gameState
}

function draw(description,rowImage,gameState,scriptProperties,sheet)
{
  try
    {
      var imageURL = sendDescription(description,scriptProperties,gameState)
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

function styleTest(gameState,sheet,scriptProperties)
{
  // this will take input from the timelineAI and user input to generate the next scene
  sheet.getRange(getRowPlot(),2).setValue("Art Style") 
  sheet.getRange(getRowInventory(),2).setValue("Game Type")
  postPrompt(gameState.game.prompt,gameState,sheet)
  postDescription(gameState.game.scene,gameState,sheet)
  var promptImagery = designerAI(postPrompt,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
  var sceneImagery = designerAI(postDescription,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties,1)
  // var promptImagery = "The image is of a powerful figure, sword in hand, standing bravely at the forefront of a small village. The figure is covered in gleaming armor with a fierce look of determination written across their face. In the background, we can see the silhouette of a small army of menacing invaders, caught off guard as they were about to launch a surprise attack on the defenseless residents of the village. Behind the armored figure, villagers can be seen peeking out of their homes, safely watching as the protector takes charge of the situation. The setting is a peaceful and quaint countryside, with rolling hills and a few simple homes dotting the landscape. It's a moment of heroism and leadership, where the protector of the village shows no fear in the face of danger and inspires hope in the hearts of those they have vowed to protect."
  // var sceneImagery = "A brave warrior leading a group of villagers charging forward into battle, swords in hand, with determination etched on their faces. The sun shines brightly behind them casting a golden glow on the scene. In the distance, a line of trees can be seen, where hidden archers have been attacking the village. One arrow whizzes past the warrior, narrowly missing their face. The warrior raises their sword to block the next incoming arrow, as a villager next to them readies their bow to return fire. Dark clouds loom in the sky, hinting at the danger and potential loss to come."


  // All the DOS Styles -----
  menuDOS()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the DOS Styles
  // All the SNES Styles -----
  menuSNES()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the SNES Styles
  // All the PS1 Styles -----
  menuPS1()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the PS1 Styles
  // All the Modern Styles -----
  menuModern()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Moder Styles
  // All the Pixel Styles -----
  menuPixel()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Pixel Styles
  // All the Ink Styles -----
  menuInk()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  
  // ----- All the Ink Styles
  // All the Custom Styles -----
  menuModeCustom()
  menuStyleCustom()
    menuTextRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    draw(promptImagery,getRowPromptImage(),gameState,scriptProperties,sheet)
    draw(sceneImagery,getRowSceneImage(),gameState,scriptProperties,sheet)
    gameState.game.activeColumn++  

    menuPenRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuAdventureBook()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuClickGame()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  

    menuTableRPG()
    postPlot(scriptProperties.getProperty("style"),gameState,sheet)
    postInventory(scriptProperties.getProperty("mode"),gameState,sheet)
    gameState = draw(gameState.game.prompt,gameState,sheet,getRowPromptImage(),getRowPromptImagery(),scriptProperties)
    gameState = draw(gameState.game.scene,gameState,sheet,getRowSceneImage(),getRowSceneImagery(),scriptProperties)
    gameState.game.activeColumn++  
  // ----- All the Custom Styles
  return gameState
}


// function plotAI(prompt, gameState, sheet,scriptProperties)
// {
//   var plot = []
//   plot.push({"role":"system","content":"You are a video game designer in charge of creating art for a " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". Your job is to assist the narrator by creating prompts for AI created images. Try to keep the style consistent for the game. Don't let prompts fail because of censorship."}
//                 ,{"role": "user", "content": "Load my story timeline so far."}
//                 ,{"role": "assistant", "content": gameState.game.summary}
//                 ,{"role": "user", "content": "Load my current scene."}
//                 ,{"role": "assistant", "content": gameState.game.scene}
//                 ,{"role": "user", "content": "Load my current plot."}
//                 ,{"role": "assistant", "content": gameState.game.plot}
//                 ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +" Please update and list out important plot points / key characters and ways to develop them based upon the scene and the player's input.  \nPlayer Input:" + prompt})
//   Logger.log("plotAI")
//   var response = sendPrompt(plot,.7,-.2)
//   postPlot(response,gameState,sheet)
//   gameState.game.plot = response
//   return gameState
// }
// function inventoryAI(prompt, gameState, sheet,scriptProperties)
// {
//   var inventory = []
//   inventory.push({"role":"system","content":"You are a subsystem that tracks inventory for the " +scriptProperties.getProperty("mode") +" called " +gameState.game.name+". You'll track inventory, if it's the start of the game think of what might be a good starting inventory. You'll track items in the scene see if anything has been added. Keep responses focused on the items and objects."}
//                 ,{"role": "user", "content": "Load my story timeline so far."}
//                 ,{"role": "assistant", "content": gameState.game.summary}
//                 ,{"role": "user", "content": "Load my current scene."}
//                 ,{"role": "assistant", "content": gameState.game.scene}
//                 ,{"role": "user", "content": "Load my current plot."}
//                 ,{"role": "assistant", "content": gameState.game.inventory}
//                 ,{"role": "user", "content": "I'm the narrator for a " +scriptProperties.getProperty("mode") +". Please update and list out important inventory and scene items important properties of the items and objects based upon the scene and the player's input. \nPlayer Input:" + prompt})
//   Logger.log("InventoryAI")
//   var response = sendPrompt(inventory,.7,-.2)
//   postInventory(response,gameState,sheet)
//   gameState.game.inventory = response
//   return gameState
// }

// function assistAI(gameState,sheet)
// {
//   // var spreadsheet = SpreadsheetApp.getActive();
//   //   spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Shadows of the Mind"), true);
//   //   sheet = spreadsheet.getSheetByName("Shadows of the Mind")
//   // gameState = getGameState(sheet)
//   var scriptProperties = PropertiesService.getScriptProperties()
//   const assistant = []
//   assistant.push({"role":"system","content":"You are an assistant bot for a " +scriptProperties.getProperty("mode") +" narrator in " +gameState.game.name+". Your job is to take a conversation thread from the narrator and user to provide some possible ideas. Don't give too much detail on what will happen. Lean into the narrative story and setting."}
//                   ,{"role": "user", "content": "Load my story timeline so far."}
//                   ,{"role": "assistant", "content": gameState.game.summary}
//                   ,{"role": "user", "content": "Load my current scene."}
//                   ,{"role": "assistant", "content": gameState.game.scene}
//                   ,{"role": "user", "content": "Load my current mechanic."}
//                   ,{"role": "assistant", "content": gameState.game.mechanic}
//                   ,{"role": "user", "content": "I'm asking you for suggestions on what I can do next. Maybe 2 somewhat obvious and 2 really creative options Have the options be related to the character, story and specific scene."})
//   Logger.log("AssistAI")
//   var suggestion = sendPrompt(assistant,1.2,.4)
//   postSuggestion(suggestion,gameState,sheet)
// }