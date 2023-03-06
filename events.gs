function onOpen() 
{
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadSheet.getSheetByName("Instructions").activate()
  menuIntialize();
}