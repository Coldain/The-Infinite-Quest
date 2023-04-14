/** @OnlyCurrentDoc */

function InsertImage() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('C1').activate();
};


function UntitledMacro() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('A1').activate();
  spreadsheet.insertSheet(5);
};