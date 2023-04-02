/*
// I've got a choose your on adventure text based rpg system in google sheets using app script. I'd like to make improvements to the code, user experience, and UI with HTML interfaces (a modal and maybe a sidebar).

// Here's some of my menu script. I'm positive we can better optimize this, making the code much smaller, easier to read, reduce extra code, modularize things, etc.
---
I've got a choose your on adventure text based rpg system in google sheets using app script. Here's some of my menu script.
---
Can I get this to all be contain in 1 menu that just pops up an HTML with these as options and a game window? Could you help me describe and outline this?
---
Could you help me with the game options, what would some of that section look like and maybe the related <script> and .gs I didn't have the actual impact of the game style or art style in (they were commented out) but here's some examples that I want to do now.

Text-Based RPG: Introduce text commands for players to interact with the environment, solve puzzles, or engage in combat.
Pen & Paper RPG: Include skill checks, ability scores, and character sheets to emulate the experience of a traditional tabletop RPG.

*/

function menuIntialize() 
{
  var ui = SpreadsheetApp.getUi();
  var gameMenu = ui.createMenu('🕺🏼GPT🤖')
    gameMenu.addItem("🗣 Open Dialogue","showDialogue")
  // gameMenu.addItem("New Game", 'menuNewGame').addItem("Play", 'menuPlay').addItem("Suggestions", 'menuSuggestions');
  // gameMenu.addSubMenu(ui.createMenu("Redo").addItem("Prompt", 'menuRedoPrompt').addItem("Scene", 'menuRedoScene').addItem("Prompt Image", 'menuRedoPromptImage').addItem("Scene Image", 'menuRedoSceneImage'));
  // gameMenu.addSubMenu(ui.createMenu("Game Type").addItem("Text-Based RPG", 'menuTextRPG').addItem("Pen & Paper RPG", 'menuPenRPG').addItem("Choose your own adventure book", 'menuAdventureBook').addItem("point & click-esq game", 'menuClickGame').addItem("table top rpg", 'menuTableRPG').addItem("custom", 'menuModeCustom'));
  // gameMenu.addSubMenu(ui.createMenu("Art Style").addItem("DOS", 'menuDOS').addItem("Super Nintendo", 'menuSNES').addItem("Playstation One", 'menuPS1').addItem("Modern Video Game", 'menuModern').addItem("Pixel Art", 'menuPixel').addItem("Ink", 'menuInk').addItem("custom", 'menuStyleCustom'));

  //.addItem("Time Fracture", 'menuTimeFracture')
  gameMenu.addToUi();
  // menuPlay()
}

function menuSuggestions()
{
 // grab the gameState, grab the most recent description, feed it to a new assistAI.
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet()
  var sheetName = sheet.getSheetName()
  if (sheetName == "Instructions" || sheetName == "New Game")
  {  
    // Insert UI to select from sheets
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Shadowrunner"), true);
    sheet = spreadsheet.getSheetByName("Shadowrunner")
  }
  Logger.log("Current Game: " + spreadsheet.getActiveSheet().getSheetName())
  var gameState = getGameState(sheet)
  assistAI(gameState,sheet)
  
}
function menuTimeFracture()
{
  var ui = SpreadsheetApp.getUi();
  ui.alert("This feature is not available yet. Will allow users to splinter time. Going back to make different choices, seeing how their story compares to the original timeline.")
}

function menuNewGame()
{
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('New Game'), true);
  spreadsheet.duplicateActiveSheet();
  var sheet = spreadsheet.getActiveSheet()
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
      'Please name your game:',
      ui.ButtonSet.OK_CANCEL);
  var text = result.getResponseText();
  try
  {
    sheet.setName(text);
  }
  catch
  {
    var result = ui.prompt(
        'That name already exists please enter a new name:',
        ui.ButtonSet.OK_CANCEL);
    var text = result.getResponseText();
    sheet.setName(text);
  }
  spreadsheet.moveActiveSheet(2);
  spreadsheet.getSheetByName('New Game').hideSheet()
  spreadsheet.getSheetByName(text).showSheet()
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName(text), true);
  postGameState(intialSetting(text),sheet)
  menuPlay()
}

function test()
{
  menuPlay(1)
}

function menuPlay(testing,sytleReview) 
{
  if(testing != 1){var ui = SpreadsheetApp.getUi();}
  var spreadsheet = SpreadsheetApp.getActive();
  var scriptProperties = PropertiesService.getScriptProperties()
  if (scriptProperties.getProperty("mode") == null)
  {
    menuModeSetting()
  }
  if (scriptProperties.getProperty("style") == null)
  {
    menuStyleSetting()
  }
  var sheet = spreadsheet.getActiveSheet()
  var sheetName = sheet.getSheetName()
  if (sheetName == "Instructions" || sheetName == "New Game")
  {  
    // Insert UI to select from sheets
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("ImageTest4"), true);
    sheet = spreadsheet.getSheetByName("ImageTest4")
  }
  Logger.log("Current Game: " + spreadsheet.getActiveSheet().getSheetName()+"\nMode: "+scriptProperties.getProperty("mode")+ "\nStyle: "+scriptProperties.getProperty("style"))
  var gameState = getGameState(sheet)
  Logger.log({gameState})
  if (sytleReview == 1)
  {
    var description = gameState.game.scene
    var prompt = gameState.game.prompt
  }
  else
  {
    var description = getDescription(gameState,sheet)
  }
  Logger.log("Current Scene: " + description)

  if(description == "")
  {
    var result = ui.prompt(
        "Active Column unable to find description. Please tell me what column number the latest description is on... example d = 4, I = 9, etc",
        ui.ButtonSet.OK_CANCEL);
    gameState.game.activeColumn = result.getResponseText();
    description = getDescription(gameState,sheet)
  }

  if (sytleReview == 1)
  {
    if (gameState.game.activeColumn >= 4)
    {
      spreadsheet.setActiveSheet(spreadsheet.getSheetByName('New Game'), true);
      spreadsheet.duplicateActiveSheet();
      var sheet = spreadsheet.getActiveSheet()
      var imageTest = parseInt(scriptProperties.getProperty("imageTest"))
      var sheetName = "ImageTest" + imageTest
      imageTest++
      scriptProperties.setProperty("imageTest",imageTest)
      sheet.setName(sheetName);
      spreadsheet.moveActiveSheet(2);
      spreadsheet.getSheetByName('New Game').hideSheet()
      spreadsheet.getSheetByName(sheetName).showSheet()
      spreadsheet.setActiveSheet(spreadsheet.getSheetByName(sheetName), true);
      gameState.game.activeColumn = 3
      postGameState(gameState,sheet)
      gameState = styleTest(gameState, sheet,scriptProperties)
      postGameState(gameState,sheet)
    }
    else
    {
      ui.alert("Must Have played at least 1 round to test the styles.")
    }
  }
  else if(testing == 1)
  {
    var text = "Use my imagination to illuminate create an orb of light that shines down upon the glowing stone on the pedestal. A cool mist begins to permeate the room. I approach and examine the stone."
    Logger.log("User Input: " + text)
    gameState.game.prompt = text
    gameState = narratorAI(text, gameState, sheet,scriptProperties)
    postGameState(gameState,sheet)
  }
  else
  {
    var result = ui.prompt(
      description,
      'Please enter your response:',
      ui.ButtonSet.OK_CANCEL);
    // Process the user's response.
    var button = result.getSelectedButton();
    var text = result.getResponseText();
    if (button == ui.Button.OK && text.length > 0) 
    {
      // User clicked "OK"
      // var text = "TALK TO THE VOICE"
      Logger.log("User Input: " + text)
      gameState.game.prompt = text
      gameState = narratorAI(text, gameState, sheet,scriptProperties)
      postGameState(gameState,sheet)
      menuPlay();
    } else if (button == ui.Button.CANCEL) {
      // User clicked "Cancel".
      ui.alert("That's okay we can continue later. Don't forget to have an adventure in the real world.");
    } else if (button == ui.Button.CLOSE) {
      // User clicked X in the title bar.
      ui.alert('You closed the dialog. Feel free to explore your timeline! ⏳');
    }
  }
}

function menuStyleSetting(style)
{
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("style",style)
    // switch (style)
    // {
    //   case "retro computer game":
    //     styleDescription = ""
    //     break;
    //   case "super nintendo game":
    //     styleDescription = ""
    //     break;
    //   case "playstation 1 game":
    //     styleDescription = ""
    //     break;
    //   case "modern video game":
    //     styleDescription = ""
    //     break;
    //   case "inkblot":
    //     styleDescription = ""
    //     break;
    //    default:
    //     style = "modern pixel-art game"
    //     styleDescription = ""
    //     break;
    // }
    // scriptProperties.setProperty("styleDescription",styleDescription)
}
function menuDOS()
{
  menuStyleSetting("retro computer game")
}
function menuSNES()
{
  menuStyleSetting("super nintendo game")
}
function menuPS1()
{
  menuStyleSetting("playstation 1 game")
}
function menuModern()
{
  menuStyleSetting("modern video game")
}
function menuPixel()
{
  menuStyleSetting("modern pixel-art game")
}
function menuInk()
{
  menuStyleSetting("ink-based cross-hatch shaded")
}



function menuModeSetting(mode)
{
    var scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty("mode",mode)
    // switch (mode)
    // {
    //   case "pen and paper role playing game":
    //     modeDescription = ""
    //     break;
    //   case "choose your own adventure book":
    //     modeDescription = ""
    //     break;
    //   case "point and click game":
    //     modeDescription = ""
    //     break;
    //   case "table top role playing game":
    //     modeDescription = ""
    //     break;
    //   default:
    //     mode =  "text-based role playing game"
    //     modeDescription = ""
    //     break;
    // }
    // scriptProperties.setProperty("modeDescription",modeDescription)
}

function menuTextRPG()
{
  menuModeSetting("text-based role playing game")
}
function menuPenRPG()
{
  menuModeSetting("pen and paper role playing game")
}
function menuAdventureBook()
{
  menuModeSetting("choose your own adventure book")
}
function menuClickGame()
{
  menuModeSetting("point and click game")
}
function menuTableRPG()
{
  menuModeSetting("table top role playing game")
}

function menuStyles(testing)
{
  menuPlay(testing,1)
}

function menuStyleTesting()
{
  menuStyles(1)
}
function menuStyleCustom()
{
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    'Please enter the style of art you want the system to try and emulate.',
    ui.ButtonSet.OK_CANCEL);
  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK && text.length > 0) 
  {
    menuStyleSetting(text)
  }
}
function menuModeCustom()
{
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    'The type of game you want the system to try and emulate.',
    ui.ButtonSet.OK_CANCEL);
  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK && text.length > 0) 
  {
    menuModeSetting(text)
  }
}

function menuRedoPromptImage()
{
  var ui = SpreadsheetApp.getUi();
  ui.alert("Not Implemented Yet")
}
function menuRedoPromptImage()
{
  var ui = SpreadsheetApp.getUi();
  ui.alert("Not Implemented Yet")
}
function menuRedoPromptImage()
{
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActive();
  var scriptProperties = PropertiesService.getScriptProperties()
  if (scriptProperties.getProperty("mode") == null)
  {
    menuModeSetting()
  }
  if (scriptProperties.getProperty("style") == null)
  {
    menuStyleSetting()
  }
  var sheet = spreadsheet.getActiveSheet()
  var sheetName = sheet.getSheetName()
  if (sheetName == "Instructions" || sheetName == "New Game")
  {  
    // Insert UI to select from sheets
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("ImageTest4"), true);
    sheet = spreadsheet.getSheetByName("ImageTest4")
  }
  var gameState = getGameState(sheet)
  var result = ui.prompt(
      'Which Column would you like to do this for?:',
      ui.ButtonSet.OK_CANCEL);
  var text = result.getResponseText();
  try
  {
    parseInt(text) 
    gameState.game.activeColumn = text
  }
  catch
  {
    throw new Error("Must be a number but recieved " +text)
  }
  draw(sheet.getRange(getRowPromptImagery(),gameState.game.activeColumn).getValue(),getRowPromptImage(),gameState,scriptProperties,sheet)
  
  
}
function menuRedoSceneImage()
{
  // var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActive();
  var scriptProperties = PropertiesService.getScriptProperties()
  if (scriptProperties.getProperty("mode") == null)
  {
    menuModeSetting()
  }
  if (scriptProperties.getProperty("style") == null)
  {
    menuStyleSetting()
  }
  var sheet = spreadsheet.getActiveSheet()
  var sheetName = sheet.getSheetName()
  if (sheetName == "Instructions" || sheetName == "New Game")
  {  
    // Insert UI to select from sheets
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("ImageTest4"), true);
    sheet = spreadsheet.getSheetByName("ImageTest4")
  }
  var gameState = getGameState(sheet)
  // var result = ui.prompt(
  //     'Which Column would you like to do this for?:',
  //     ui.ButtonSet.OK_CANCEL);
  // var text = result.getResponseText();
  var text = 4
  try
  {
    text = parseInt(text) 
    gameState.game.activeColumn = text
  }
  catch
  {
    throw new Error("Must be a number but recieved " +text)
  }
  draw(sheet.getRange(getRowSceneImagery(),gameState.game.activeColumn).getValue(),getRowSceneImage(),gameState,scriptProperties,sheet)
}
