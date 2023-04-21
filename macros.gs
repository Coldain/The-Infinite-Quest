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

function openAudioPlayer() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getActiveCell();
  var url = range.getValue();
  if (url.indexOf('http') === 0) {
    var html = '<audio src="' + url + '" controls autoplay></audio>';
    var userInterface = HtmlService.createHtmlOutput(html);
    SpreadsheetApp.getUi().showModalDialog(userInterface, 'Audio Player');
  }
}