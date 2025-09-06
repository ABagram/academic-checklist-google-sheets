/**
 * A special function that runs when the spreadsheet is opened.
 * It creates a custom menu to make the script easy to run.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Curriculum Tools')
      .addItem('Update Checklist', 'updateCurriculumChecklist')
      .addSeparator()
      .addItem('View Course Status Summary', 'showCoursesSidebar')
      .addToUi();
}

/**
 * Creates and shows the custom HTML sidebar for displaying course status.
 */
function showCoursesSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('CoursesSidebar')
      .setWidth(300)
      .setTitle('Course Status Summary');
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Stores the course status data in script properties for persistence.
 */
function storeCourseStatus() {
  const statusData = getCourseStatusList();
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('lastUpdated', statusData.lastUpdated.getTime());
  properties.setProperty('courseData', JSON.stringify(statusData));
}

/**
 * Retrieves the stored course status data and formats the date.
 */
function getStoredCourseStatus() {
  const properties = PropertiesService.getScriptProperties();
  const storedData = properties.getProperty('courseData');
  const lastUpdated = properties.getProperty('lastUpdated');

  if (storedData) {
    const data = JSON.parse(storedData);
    data.lastUpdated = new Date(Number(lastUpdated)).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return data;
  }
  
  return null; // Return null if no data is stored
}

// -------------------------------------------------------------------------------------------------
// Optimized Functions to reduce spreadsheet calls
// -------------------------------------------------------------------------------------------------

/**
 * Creates an in-memory map of course codes to their status from the College Dashboard sheet.
 * @return {Object} A map where keys are course codes and values are their status.
 */
function createCollegeDashboardMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('College Dashboard');
  const lastRow = sheet.getLastRow();
  
  // Read all data in one go
  const data = sheet.getRange(1, 2, lastRow, 7).getValues(); // Columns B to H
  
  const collegeDashboardMap = {};
  let latestTerm = "";
  
  // Find the latest term first in a single pass
  for (let i = data.length - 1; i >= 0; i--) {
      if (String(data[i][0]).trim() !== "") { // Column B (Term)
          latestTerm = String(data[i][0]).trim();
          break;
      }
  }

  // Now process the data to build the map
  let currentTerm = "";
  for (let i = 0; i < data.length; i++) {
    const termCell = String(data[i][0]).trim();
    const courseCode = String(data[i][1]).trim(); // Column C
    const grade = data[i][6]; // Column H
    
    if (termCell !== "") {
        currentTerm = termCell;
    }
    
    if (courseCode !== "") {
        let status = "";
        if (currentTerm === latestTerm && (String(grade).trim() === "" || grade === 0)) {
            status = "ENROLLED";
        } else if (grade > 0 || String(grade).trim() === "PASSED") {
            status = "PASSED (" + currentTerm + ")";
        } else if (grade === 0 || String(grade).trim() === "FAILED") {
            status = "FAILED (" + currentTerm + ")";
        }
        
        // Always store the latest status for a course code
        collegeDashboardMap[courseCode] = status;
    }
  }
  return collegeDashboardMap;
}

/**
 * Provides a unified status for a course using pre-fetched data.
 * @param {string} courseCode - The course code to check.
 * @param {Object} collegeDashboardMap - A map of course codes to their status and term.
 * @param {Array<Array>} courseBlockData - A 2D array of the rows for the specific course block.
 * @return {string} The status of the course.
 */
function getCourseStatusOptimized(courseCode, collegeDashboardMap, courseBlockData) {
  const trimmedCourseCode = String(courseCode).trim();
  
  // Step 1: Check if the course is already taken using the in-memory map
  const primaryCourseStatus = collegeDashboardMap[trimmedCourseCode] || "";
  if (primaryCourseStatus !== "") {
    return primaryCourseStatus;
  }

  // Step 2: If not taken, check prerequisites using in-memory data
  const missingPrereqs = [];
  
  // Use indices from the courseBlockData, which is a slice of the main data
  for (let i = 0; i < courseBlockData.length; i++) {
    const prereqType = String(courseBlockData[i][5]).trim(); // Column H in the original sheet
    const prereqCode = String(courseBlockData[i][6]).trim(); // Column I in the original sheet
    
    if (prereqCode === "") {
      continue;
    }

    const prereqStatus = collegeDashboardMap[prereqCode] || "";
    const isHardOrEssential = (prereqType === "H" || prereqType === "E");
    const isSoft = (prereqType === "S");

    if (isHardOrEssential) {
      if (!prereqStatus.includes("PASSED")) {
          if (prereqStatus.includes("ENROLLED")) {
              missingPrereqs.push(prereqCode + " (Enrolled)");
          } else if (prereqStatus.includes("FAILED")) {
              missingPrereqs.push(prereqCode + " (Not Passed)");
          } else {
              missingPrereqs.push(prereqCode + " (Not Taken)");
          }
      }
    } else if (isSoft) {
      if (prereqStatus === "") {
          missingPrereqs.push(prereqCode + " (Not Taken)");
      }
    }
  }
  
  if (missingPrereqs.length === 0) {
    return "READY";
  } else {
    return "Prerequisites Not Met: " + missingPrereqs.join(", ");
  }
}

/**
 * A helper function to find all courses that depend on a given prerequisite, using pre-fetched data.
 * @param {string} prereqCode - The course code to search for.
 * @param {Array<Array>} checklistData - The full 2D array of the curriculum checklist.
 * @return {Array<Object>} An array of objects like `{course: 'LBYMF3D', type: 'H'}`.
 */
function getPrerequisiteDependentsOptimized(prereqCode, checklistData) {
  const dependents = [];
  
  for (let i = 0; i < checklistData.length; i++) {
    const prereqType = String(checklistData[i][5]).trim(); // Column H
    const prereqCourseCode = String(checklistData[i][6]).trim(); // Column I
    
    if (prereqCourseCode === prereqCode) {
      const dependentCourse = String(checklistData[i][2]).trim(); // Column E
      dependents.push({ course: dependentCourse, type: prereqType });
    }
  }
  return dependents;
}

/**
 * Fetches all courses and their status to be displayed in the sidebar, using optimized in-memory processing.
 * @return {Object} An object containing all categorized and sorted course data.
 */
function getCourseStatusList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Curriculum Checklist');
  const lastRow = sheet.getLastRow();
  
  // Read all necessary data in a single batch call (Columns C to I)
  const checklistData = sheet.getRange(4, 3, lastRow - 5, 7).getValues();
  
  // Using a plain object to store data for each period
  const periodData = {};
  const failedCourses = [];
  const enrolledCourses = [];
  
  // An array to explicitly track the order of periods as they appear in the sheet
  const orderedPeriods = [];
  let currentPeriod = "";
  
  // Create an in-memory map for quick lookups
  const collegeDashboardMap = createCollegeDashboardMap();
  
  for (let i = 0; i < checklistData.length; i++) {
    const row = checklistData[i];
    const periodCellValue = String(row[0]).trim();
    const courseCode = String(row[2]).trim();
    
    // Check if it's a new period header. We'll use this to set the current period
    // and to build our list of periods in the correct order.
    if (periodCellValue !== "") {
      currentPeriod = periodCellValue;
      if (!orderedPeriods.includes(currentPeriod)) {
        orderedPeriods.push(currentPeriod);
        periodData[currentPeriod] = { ready: [], notReady: [] };
      }
    }
    
    // If the row has a course code, process it using the currentPeriod.
    if (courseCode !== "") {
      // Find the entire course block's data for prerequisite checking.
      let endOfBlock = i;
      while (endOfBlock + 1 < checklistData.length && String(checklistData[endOfBlock + 1][2]).trim() === "") {
        endOfBlock++;
      }
      const courseBlockData = checklistData.slice(i, endOfBlock + 1);
      
      const status = getCourseStatusOptimized(
        courseCode, 
        collegeDashboardMap, 
        courseBlockData
      );

      // Categorize the course based on its status
      if (status === "READY") {
        if (currentPeriod !== "" && periodData[currentPeriod]) {
          periodData[currentPeriod].ready.push(courseCode);
        }
      } else if (status.includes("FAILED")) {
        const dependents = getPrerequisiteDependentsOptimized(courseCode, checklistData);
        const dependentsString = dependents.length > 0 ? 
            " (Prerequisite for: " + dependents.map(d => `${d.course}(${d.type})`).join(", ") + ")" : "";
        failedCourses.push(courseCode + dependentsString);
      } else if (status.includes("ENROLLED")) {
        enrolledCourses.push(courseCode);
      } else if (!status.includes("PASSED")) { 
        if (currentPeriod !== "" && periodData[currentPeriod]) {
          periodData[currentPeriod].notReady.push(courseCode + " (" + status + ")");
        }
      }
      // Skip the rest of the rows in this course block to avoid reprocessing.
      i = endOfBlock;
    }
  }
  
  // Build the final, sorted arrays by iterating over the orderedPeriods array.
  // This ensures the periods in the output always match the spreadsheet order.
  const readyPeriods = [];
  const notReadyPeriods = [];
  
  orderedPeriods.forEach(period => {
    const data = periodData[period];
    if (data && data.ready.length > 0) {
      readyPeriods.push({ period: period, courses: data.ready });
    }
    if (data && data.notReady.length > 0) {
      notReadyPeriods.push({ period: period, courses: data.notReady });
    }
  });

  return { 
    readyPeriods: readyPeriods, 
    notReadyPeriods: notReadyPeriods, 
    failed: failedCourses,
    enrolled: enrolledCourses,
    lastUpdated: new Date()
  };
}

// -------------------------------------------------------------------------------------------------
// Existing functions (not optimized as they're not the bottleneck)
// -------------------------------------------------------------------------------------------------

/**
 * Automatically applies a border to every row that is not a divider.
 */
function autoBorders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Curriculum Checklist');
  
  // Clear all existing borders to prevent conflicts
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, lastRow, lastCol).setBorder(false, false, false, false, false, false);
  
  // 1. Apply a border to the header row (Row 2)
  sheet.getRange("B2:I2").setBorder(true, true, true, true, true, true);
  
  // 2. Loop through the main data rows (Row 4 to the row before the totals)
  const data = sheet.getRange("B4:I" + (lastRow - 2)).getValues();

  for (let i = 0; i < data.length; i++) {
    const isRowEmpty = data[i].map(cell => String(cell).trim()).every(cell => cell === "");
    if (!isRowEmpty) {
      sheet.getRange(i + 4, 2, 1, 8).setBorder(true, true, true, true, true, true);
    }
  }

  // 3. Apply a border to the totals row (2nd to last row)
  sheet.getRange("B" + (lastRow - 2) + ":I" + (lastRow - 2)).setBorder(true, true, true, true, true, true);
}

/**
 * Automatically merges cells in column B based on merged blocks in column E.
 */
function autoMergeStatusCells() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Curriculum Checklist');
  
  // Un-merge existing cells in the status column (Column B) only
  sheet.getRange("B:B").breakApart();
  
  const lastRow = sheet.getLastRow();
  const data = sheet.getRange(4, 5, lastRow - 5, 5).getValues(); 
  
  let startRow = 4;
  
  for (let i = 0; i < data.length; i++) {
    const isCurrentCourseCell = String(data[i][0]).trim() !== "";
    const isRowCompletelyEmpty = data[i].map(cell => String(cell).trim()).every(cell => cell === "");

    // If we're at the start of a new course OR an empty divider row, merge the previous block
    if ((isCurrentCourseCell && i > 0) || isRowCompletelyEmpty) {
        const endRow = i + 3;
        const numRows = endRow - startRow + 1;

        if (numRows > 1) {
          // Merging in column B only
          sheet.getRange(startRow, 2, numRows, 1).merge();
        }
        startRow = i + 4; // Start the next block on the current row
    }
  }
  
  // Handle the very last block in the sheet
  const numRows = (lastRow - 2) - startRow + 1;
  if (numRows > 1) {
    sheet.getRange(startRow, 2, numRows, 1).merge();
  }
}

/**
 * Provides a unified status for a course, including term taken or prerequisite status.
 */
function getCourseStatus(courseCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const curriculumChecklistSheet = ss.getSheetByName('Curriculum Checklist');
  
  const trimmedCourseCode = String(courseCode).trim();
  
  // Find the row of the course code automatically in the new column E
  const coursesColumn = curriculumChecklistSheet.getRange('E:E').getValues().flat();
  let startRow = -1;
  for (let i = 0; i < coursesColumn.length; i++) {
    if (String(coursesColumn[i]).trim() === trimmedCourseCode) {
      startRow = i + 1;
      break;
    }
  }

  if (startRow === -1) {
    return "Course not found";
  }

  // --- Step 1: Check if the course is already taken ---
  const primaryCourseStatus = getStatusAndTerm(trimmedCourseCode);
  
  // A non-empty status means the course has a record in the dashboard
  if (primaryCourseStatus !== "") {
    return primaryCourseStatus;
  }

  // --- Step 2: If not taken, check prerequisites ---
  const allData = curriculumChecklistSheet.getRange(4, 5, curriculumChecklistSheet.getLastRow() - 5, 5).getValues();
  let endRow = allData.length + 4; 

  for (let i = startRow - 4; i < allData.length; i++) {
    const isNextCourseCell = String(allData[i][0]).trim() !== "" && String(allData[i][0]).trim() !== trimmedCourseCode;
    const isRowCompletelyEmpty = allData[i].map(cell => String(cell).trim()).every(cell => cell === "");

    if (isNextCourseCell || isRowCompletelyEmpty) {
      endRow = i + 4;
      break;
    }
  }

  const prereqTypes = curriculumChecklistSheet.getRange(startRow, 8, endRow - startRow, 1).getValues().flat();
  const prereqCodes = curriculumChecklistSheet.getRange(startRow, 9, endRow - startRow, 1).getValues().flat();

  let missingPrereqs = [];

  for (let i = 0; i < prereqCodes.length; i++) {
    const prereqType = String(prereqTypes[i]).trim();
    const prereqCode = String(prereqCodes[i]).trim();
    
    if (prereqCode === "") {
      continue;
    }

    const prereqStatus = getStatusAndTerm(prereqCode);
    
    // Check for missing prerequisites based on new logic
    const isHardOrEssential = (prereqType === "H" || prereqType === "E");
    const isSoft = (prereqType === "S");

    if (isHardOrEssential) {
      if (!prereqStatus.includes("PASSED")) {
          if (prereqStatus.includes("ENROLLED")) {
              missingPrereqs.push(prereqCode + " (Enrolled)");
          } else if (prereqStatus.includes("FAILED")) {
              missingPrereqs.push(prereqCode + " (Not Passed)");
          } else {
              missingPrereqs.push(prereqCode + " (Not Taken)");
          }
      }
    } else if (isSoft) {
      // Soft prerequisites only block if the course has not been taken at all
      if (prereqStatus === "") {
          missingPrereqs.push(prereqCode + " (Not Taken)");
      }
    }
  }
  
  if (missingPrereqs.length === 0) {
    return "READY";
  } else {
    return "Prerequisites Not Met: " + missingPrereqs.join(", ");
  }
}

function getStatusAndTerm(courseCode) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('College Dashboard');
  const courseCodes = sheet.getRange("C:C").getValues().flat();
  const grades = sheet.getRange("H:H").getValues().flat();
  const terms = sheet.getRange("B:B").getValues().flat();

  let lastMatchIndex = -1;
  for (let i = courseCodes.length - 1; i >= 0; i--) {
    if (String(courseCodes[i]).trim() == String(courseCode).trim()) {
      lastMatchIndex = i;
      break;
    }
  }

  if (lastMatchIndex === -1) {
    return "";
  }
  
  const grade = grades[lastMatchIndex];
  
  // Find the closest non-empty term for the course entry
  let term = "";
  for (let i = lastMatchIndex; i >= 0; i--) {
    if (String(terms[i]).trim() !== "") {
      term = String(terms[i]).trim();
      break;
    }
  }

  // Find the latest term in the entire list to check for "ENROLLED" status
  let latestTerm = "";
  for (let i = terms.length - 1; i >= 0; i--) {
    if (String(terms[i]).trim() !== "") {
      latestTerm = String(terms[i]).trim();
      break;
    }
  }

  // 1. Check if the course is ENROLLED (in the latest term with no grade)
  if (term === latestTerm && (String(grade).trim() === "" || grade === 0)) {
      return "ENROLLED";
  }

  // 2. Check if the course is PASSED
  if (grade > 0 || String(grade).trim() === "PASSED") {
    return "PASSED (" + term + ")";
  } 
  
  // 3. Check if the course is FAILED
  else if (grade === 0 || String(grade).trim() === "FAILED") {
    return "FAILED (" + term + ")";
  }

  // 4. Default return for cases like a past course with no grade
  return "";
}

/**
 * Automates the entire curriculum checklist: merges cells and populates the status column.
 */
function updateCurriculumChecklist() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Curriculum Checklist');
  
  // Show starting toast message
  ss.toast('Starting curriculum checklist update...', 'Status');
  Utilities.sleep(1000); // 1-second delay
  
  ss.toast('Step 1 of 3: Applying borders...', 'Status');
  autoBorders();
  Utilities.sleep(1000);
  
  ss.toast('Step 2 of 3: Merging cells...', 'Status');
  autoMergeStatusCells();
  Utilities.sleep(1000);
  
  const lastRow = sheet.getLastRow();
  
  // Read all courses from the checklist into memory
  const allChecklistData = sheet.getRange(4, 3, lastRow - 5, 7).getValues();
  const statusColumn = [];
  
  // Create the in-memory lookup map from the College Dashboard sheet once
  const collegeDashboardMap = createCollegeDashboardMap();

  const totalRows = allChecklistData.length;
  let processedRows = 0;

  ss.toast('Step 3 of 3: Updating course status... 0%', 'Status');
  Utilities.sleep(1000);

  // Loop through all data in memory
  let i = 0;
  while (i < allChecklistData.length) {
    const courseCode = String(allChecklistData[i][2]).trim();
    
    if (courseCode !== "") {
      // Find the end of this course block
      let endOfBlock = i;
      while (endOfBlock + 1 < allChecklistData.length && String(allChecklistData[endOfBlock + 1][2]).trim() === "") {
        endOfBlock++;
      }
      
      const courseBlockData = allChecklistData.slice(i, endOfBlock + 1);
      
      const status = getCourseStatusOptimized(
        courseCode,
        collegeDashboardMap,
        courseBlockData
      );

      statusColumn.push([status]);

      // Add empty strings for the rest of the block's rows to keep the array length correct for writing back
      for (let j = 0; j < (endOfBlock - i); j++) {
        statusColumn.push([""]);
      }
      i = endOfBlock + 1;
    } else {
      statusColumn.push([""]); // Empty row
      i++;
    }
    
    processedRows++;
    // Update toast message every 10%
    if (totalRows > 0 && processedRows % Math.ceil(totalRows / 10) === 0) {
      const percentage = Math.round((processedRows / totalRows) * 100);
      ss.toast('Step 3 of 3: Updating course status... ' + percentage + '%', 'Status');
    }
  }

  // Write the entire status column in a single batch operation
  sheet.getRange(4, 2, statusColumn.length, 1).setValues(statusColumn);

  // Show final toast message
  ss.toast('Update complete!', 'Status');
  
  // Store the data and then show the sidebar
  storeCourseStatus();
  showCoursesSidebar();
}
