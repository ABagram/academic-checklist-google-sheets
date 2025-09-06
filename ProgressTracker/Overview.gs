/**
 * Retrieves total units and GPA for each academic period from the "College Dashboard" sheet
 * and writes the data to the overview section on the same sheet.
 *
 * This version handles the case where a term GPA is 0 by not writing anything
 * to the corresponding cell in Column O.
 */
function updateOverviewOnDashboard() {
  const sheetName = 'College Dashboard';
  
  // Dashboard Column Indices for reading data (zero-based).
  const termCol = 1; // Column B
  const courseCodeCol = 2; // Column C
  const totalUnitsCol = 6; // Column G
  const gpaCol = 8; // Column I

  // Overview Column Indices for writing data.
  const overviewStartRow = 20;
  const unitsOutputCol = 14; // Column N
  const gpaOutputCol = 15; // Column O
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    Logger.log('Error: The sheet "College Dashboard" does not exist.');
    return;
  }
  
  const sheetData = sheet.getDataRange().getValues();
  
  // Arrays to hold data for each output column.
  const units = [];
  const gpas = [];
  
  let currentPeriod = '';

  // Iterate over each row to collect the data from the dashboard section.
  for (let i = 0; i < sheetData.length; i++) {
    const row = sheetData[i];
    
    // Find the academic period name.
    if (row[termCol] !== '') {
      currentPeriod = row[termCol];
    }

    // Identify the footer row using the provided structure.
    if (row[courseCodeCol] === '' && row[totalUnitsCol] !== '' && row[gpaCol] !== '') {
      const totalUnits = row[totalUnitsCol];
      const termGPA = row[gpaCol];
      
      // Push the total units.
      units.push([totalUnits]);
      
      // Conditionally push the GPA or an empty string.
      // We check if the GPA is exactly 0.
      if (termGPA === 0) {
        gpas.push(['']);
      } else {
        gpas.push([termGPA]);
      }
    }
  }

  // Determine the last row of the overview section to clear old data.
  const lastRow = sheet.getLastRow();
  const rowsToClear = lastRow - overviewStartRow + 1;

  if (rowsToClear > 0) {
    // Clear old data from columns N and O.
    sheet.getRange(overviewStartRow, unitsOutputCol, rowsToClear, 1).clearContent();
    sheet.getRange(overviewStartRow, gpaOutputCol, rowsToClear, 1).clearContent();
  }

  // Write the new data to the correct columns.
  if (units.length > 0) {
    sheet.getRange(overviewStartRow, unitsOutputCol, units.length, 1).setValues(units);
    sheet.getRange(overviewStartRow, gpaOutputCol, gpas.length, 1).setValues(gpas);
  }

  Logger.log('Successfully updated the overview section in columns N and O.');
}
