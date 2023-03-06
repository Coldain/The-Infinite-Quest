function menuIntialize() 
{
  var ui = SpreadsheetApp.getUi();
  var apiMenu = ui.createMenu('Text RPG')
  apiMenu.addItem("New Game", 'menuNewGame').addItem("Play", 'menuPlay').addItem("Suggestions", 'menuSuggestions').addItem("Time Fracture", 'menuTimeFracture');
  apiMenu.addToUi();
  menuPlay()
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
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("The Last City"), true);
    sheet = spreadsheet.getSheetByName("The Last City")
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
  }
  spreadsheet.moveActiveSheet(2);
  spreadsheet.getSheetByName('New Game').hideSheet()
  spreadsheet.getSheetByName(text).showSheet()
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName(text), true);
  postGameState(intialSetting(text),sheet)
  menuPlay()
}

function menuPlay() 
{
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet()
  var sheetName = sheet.getSheetName()
  if (sheetName == "Instructions" || sheetName == "New Game")
  {  
    // Insert UI to select from sheets
    spreadsheet.setActiveSheet(spreadsheet.getSheetByName("The Last City"), true);
    sheet = spreadsheet.getSheetByName("The Last City")
  }
  Logger.log("Current Game: " + spreadsheet.getActiveSheet().getSheetName())
  var gameState = getGameState(sheet)
  Logger.log({gameState})
  var description = getDescription(gameState,sheet)
  Logger.log("Current Scene: " + description)

  if(description == "")
  {
    var result = ui.prompt(
        "Active Column unable to find description. Please tell me what column number the latest description is on... example d = 4, I = 9, etc",
        ui.ButtonSet.OK_CANCEL);
    gameState.game.activeColumn = result.getResponseText();
    description = getDescription(gameState,sheet)
  }
  var result = ui.prompt(
      description,
      'Please enter your response:',
      ui.ButtonSet.OK_CANCEL);
  // Process the user's response.
  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK && text.length > 0) {
    // User clicked "OK"
    // var text = "My name is Axzle and I'm from The Last City: A post-apocalyptic game where you navigate the ruins of a once-great metropolis and struggle to survive in a world ruled by chaos and destruction."
    Logger.log("User Input: " + text)
    gameState.prompt = text
    gameState = narratorAI(text, gameState, sheet)
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