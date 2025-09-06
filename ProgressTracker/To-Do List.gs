/**
 * Triggers on a spreadsheet edit to handle setting status, hiding rows, and sorting.
 * This script will only run for sheets containing the word "Requirements" in their name.
 * @param {Object} e The event object.
 */
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var sheetName = sheet.getName();
  
  // Exit if the sheet name does not contain the word "Requirements"
  if (sheetName.indexOf("Requirements") === -1) {
    return;
  }
  
  var editedColumn = e.range.getColumn();
  var editedRow = e.range.getRow();

  // Get the headers to find column indices
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var editedHeader = headers[editedColumn - 1]; 
  var statusColumnIndex = headers.indexOf("Status") + 1;
  var statusValue = sheet.getRange(editedRow, statusColumnIndex).getValue();

  // --- AUTOMATIC "IN PROGRESS" STATUS LOGIC ---
  // Check if the edited column is "Requirement" or "Description" AND the status cell is empty
  if (editedHeader === "Requirement" || editedHeader === "Description") {
    if (!statusValue) {
      sheet.getRange(editedRow, statusColumnIndex).setValue("In Progress");
      // Re-fetch the status value after setting it
      statusValue = "In Progress"; 
    }
  }

  // --- HIDE ROW LOGIC ---
  // Check if the edited column is "Status" and the new value is "Done"
  if (editedHeader === "Status") {
    statusValue = e.range.getValue(); // Get the latest value from the event object
    if (statusValue && typeof statusValue === 'string' && statusValue.trim().toLowerCase() === "done") {
      Utilities.sleep(500); 
      sheet.hideRows(editedRow);
    }
  }

  // --- SORT LOGIC ---
  // Sort the sheet if a relevant column is edited
  if (editedHeader === "Status" || editedHeader === "Due Date" || editedHeader === "Due Time" || editedHeader === "Start Time") {
    sortSheet(sheet);
  }
}

/**
 * Sorts the active sheet by Due Date, then Due Time, then Start Time.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet The sheet to sort.
 */
function sortSheet(sheet) {
  // Get the header row
  var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Find the column indices for "Due Date", "Due Time", and "Start Time"
  var dueDateIndex = headerRow.indexOf("Due Date") + 1;
  var dueTimeIndex = headerRow.indexOf("Due Time") + 1;
  var startTimeIndex = headerRow.indexOf("Start Time") + 1;

  // Sort the sheet based on the found indices
  sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
       .sort([{ column: dueDateIndex, ascending: true }, { column: dueTimeIndex, ascending: true }, { column: startTimeIndex, ascending: true }]);
}
