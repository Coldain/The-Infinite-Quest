class Game
{
  // Constructor
  Game()
  {
    spreadsheet = SpreadsheetApp.getActive();
    sheet = spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Current Game'), true);
    state = JSON.parse(sheet.getRange("B7").getValue());
  }
  // Fields
  // Functions
  refreshState()
  {
    state = JSON.parse(sheet.getRange("B7").getValue())
  }
  saveState()
  {
    sheet.getRange("B7").setValue = state
  }
  getMessages()
  {
    messages = sheet.getRange(7,state.game.activeColumn).getValue
  }
  setMessages()
  {
    sheet.getRange(7,state.game.activeColumn).setValue = messages
  }

}