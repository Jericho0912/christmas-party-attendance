// This function is used to query data from the spreadsheet


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


// This is the entry point for rendering the HTML template when accessed via GET request
function doGet() {
  let template = HtmlService.createTemplateFromFile('index');
  let html = template.evaluate().setTitle('Christmas Party Attendance Scanner');

  // Allow the page to be embedded
  html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1');

  return html;
}

// Define the name of the sheet to store the form data
const sheetName = "AttendanceSheet";

// Function to handle form submission and send data to Google Sheets
function processForm(formObject) {
  const ss = SpreadsheetApp.getActive();
  const dataSheet = ss.getSheetByName(sheetName);

  // Append form data to the sheet
  dataSheet.appendRow([
    new Date().toLocaleString(),  // Timestamp
    formObject.employeeCode,       // QR scanned product code (identifier)
    formObject.Name,              // Name
    formObject.Email,             // Email
    formObject.Group,             // Group
    formObject.ManagementLevel   // Management Level
  ]);
}

// Utility function to include HTML files (e.g., for CSS/JS imports)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}




