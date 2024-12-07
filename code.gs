function practice(){

  const sheet = SpreadsheetApp.openByUrl("");
  const name = sheet.getSheetByName("Sheet1");

  const columnID = 1;

  const lstColumn = name.getLastColumn();
  const lstRow = name.getLastRow();
  
  let data = name.getRange(1,1, lstRow, 1).getValues();
  for(let i = 1; i < data.length; i++){
    console.log(data[i]);
  }
}