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


// Function to get the employee data based on ID
function getSheetData(id) {
  try {
    Logger.log("Searching for employee ID: '" + id + "'"); // Log the ID being searched
    
    // Replace with the actual sheet URL
    const sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mrf6F9Ta2bCG8y63APaT64EP0uIRysTJHoShqUjI0TM/");
    const name = sheet.getSheetByName("Sheet1");
    const columnID = 1;  // Column 1 contains the employee codes
    const range = name.getRange(1, columnID, name.getLastRow(), 1);  // Get all employee codes in the column
    const ids = range.getValues().flat();  // Flatten the 2D array into a 1D array

    // Sanitize input ID by trimming spaces
    const sanitizedID = String(id).trim();  // Convert to string and trim spaces from the scanned ID
    Logger.log("Sanitized Employee ID: '" + sanitizedID + "'"); // Log sanitized ID
    
    // Find the index of the sanitized ID in the sheet
    const rowIndex = ids.findIndex(function(code) {
      return String(code).trim() === sanitizedID;  // Trim spaces from each code in the sheet for comparison
    });

    Logger.log("Row index found: " + rowIndex); // Log the row index (remember, this is zero-based)

    if (rowIndex === -1) {
      Logger.log("ID not found");  // Log if ID is not found
      return null;
    }

    // Adjust rowIndex to be 1-based for Google Sheets
    const rowData = name.getRange(rowIndex + 1, 1, 1, name.getLastColumn()).getValues()[0];
    Logger.log("Row data: " + rowData);  // Log the row data
    
    // Return the user data in the expected format
    return {
      name: rowData[1],         // Assuming name is in column 2 (adjust if necessary)
      email: rowData[2],        // Assuming email is in column 3 (adjust if necessary)
      group: rowData[3],        // Assuming group is in column 4 (adjust if necessary)
      managementLevel: rowData[4] // Assuming management level is in column 5 (adjust if necessary)
    };
  } catch (error) {
    Logger.log("Error accessing the sheet or retrieving data: " + error);
    return null;
  }
}

// Function to be called from frontend (HTML/JS)
function getEmployeeData(employeeCode) {
  Logger.log("Received employee code from frontend: '" + employeeCode + "'"); // Log received code
  
  if (employeeCode) {
    return getSheetData(employeeCode);  // Pass the employee code correctly to getSheetData
  } else {
    Logger.log("Error: employee code is undefined or invalid");
    return null;
  }
}

