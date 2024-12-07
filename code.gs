function practice(id){
  try {
    const sheet = SpreadsheetApp.openByUrl("");
    const name = sheet.getSheetByName("Sheet1");

    const columnID = 1;
    const range = name.getRange(1, columnID, name.getLastRow(), 1);
    const ids = range.getValues().flat();
    const rowIndex = ids.indexOf(id);

    if(rowIndex === -1){
      console.log("ID not found");
      return null;
    }
    
    const rowData = name.getRange(rowIndex + 1, 1, 1, name.getLastColumn()).getValues()[0];
    return rowData;
  } catch (error) {
    console.error("Error accessing the sheet or retrieving data:", error);
    return null;
  }
}

function onQRCodeScan(){
  const scannedID = 1001; // Replace with actual scanned ID from QR code
  const data = practice(scannedID);
  if(data){
    console.log("Scanned Data:", data);
  } else {
    console.log("No Data found for the scanned ID");
  }
}
