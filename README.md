<div align="center">
  <h1>Academic Checklist + ProgressTracker</h1>
  
  <p>
    <b>A semi-automated degree tracking system for Academic Checklist.</b><br />
    Streamline course enlistment and track flowchart progress with integrated Apps Script automation.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Version-36-brightgreen?style=for-the-badge" alt="Version">
    <img src="https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" alt="Google Sheets">
    <img src="https://img.shields.io/badge/Apps%20Script-4285F4?style=for-the-badge&logo=google-apps-script&logoColor=white" alt="Google Apps Script">
  </p>
</div>

## Academic Checklist
### Templates
| Sheet Name    | Description |
| ------------- |-------------- |
|`College Dashboard`|All information related to student's current academic standing are included in this sheet.|
|`Honors Criteria`|By default, the honors criteria are set according to the requirements stated in the [De La Salle University (DLSU) Student Handbook for Academic Year 2021-2025](https://www.dlsu.edu.ph/wp-content/uploads/pdf/osa/student-handbook.pdf). This may be updated as needed.|
|`Curriculum Checklist`||
|`{Academic Period #} Dashboard`| (Default: Term # Dashboard. Note: Change the `#` into the actual semester/term number followed. Since this is controlled by a script, make sure to follow the format properly.)|
|`{Academic Period #} Requirements`| (Default: Term # Requirements. Note: Change the `#` into the actual semester/term number followed. Since this is controlled by a script, make sure to follow the format properly.)|

### Color Palette
|General Color Name|Preview|Hex Code|
|----------|---|---|
|Light Blue|![#e9eff8](https://placehold.co/15x15/e9eff8/e9eff8.png)|`#e9eff8`|
|Light Green|![#e5f3da](https://placehold.co/15x15/e5f3da/e5f3da.png)|`#e5f3da`|
|Light Gray|![#f3f3f3](https://placehold.co/15x15/f3f3f3/f3f3f3.png)|`#f3f3f3`|
## Automated Features
### Curriculum Audit
- Utilizes manually-entered data in `College Dashboard` to determine course status.
  |Status|Interpretation|Notes|
  |-------------|--------------|--|
  |![Static Badge](https://img.shields.io/badge/Prerequisites_Not_Met%3A_<Hard_Prerequisite_Not_Passed>_(Not_Passed)-fff1e6?style=flat-square)|Course has *hard prerequisites* that have not been passed.||
  |![Static Badge](https://img.shields.io/badge/Prerequisites_Not_Met%3A_<Soft_Prerequisite_Not_Taken>_(Not_Taken)-fff1e6?style=flat-square)|Course has *soft prerequisites* that have not been taken.||
  |![Static Badge](https://img.shields.io/badge/READY-e5f3da?style=flat-square)|Course is ready to be enlisted (i.e., all prerequisites have been met).|Due to lack of information on course offerings, the script simply assumes that the course is offered every term.|
  |![Static Badge](https://img.shields.io/badge/ENROLLED-fffcc0?style=flat-square)|Course is currently enrolled.|If the latest instance of the course code is found with no corresponding grade, the script assumes that it is currently enrolled. For accuracy, update the `College Dashboard` and trigger `Update Curriculum Checklist` regularly.
  |![Static Badge](https://img.shields.io/badge/PASSED_(PERIOD_%23)-ffffff?style=flat-square)|Course has been passed (i.e., grade of > 0.0 or "PASSED").|
  |![Static Badge](https://img.shields.io/badge/ENROLLED_(PERIOD_%23)-ffecf1?style=flat-square)|course had been taken but grade is 0.0 or "FAILED".|

> [!NOTE]
> ![Static Badge](https://img.shields.io/badge/READY-e5f3da?style=flat-square) 
> 2. 
- Example: <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3743536c-9f53-48dd-895e-ad37bf3346a9" />
- Dependencies: `College Dashboard`

### Course Status Summary
- Displays a side sheet that lists all courses that are `Ready to Take`, `Courses with Missing Prerequisites`, `Currently Enrolled`, and `Courses to Retake`, streamlining the academic plan for the succeeding terms.
- Example: <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/bf1af141-050a-4ae3-a37a-7712c81ba568" />
- Dependencies: `College Dashboard` and `Curriculum Checklist`.

|Feature|Dependencies|Example|
|-------|------------|-------|
|Curriculum Audit|||
|Course Status Summary |||
|Current Week Calculation and Visualization|Sheets that contain "Weekly Schedule" in their name (e.g.  `Term 10 Weekly Schedule`)|
|Weekly Schedule Visualization|Sheets that contain "Weekly Schedule" in their name (e.g.  `Term 10 Weekly Schedule`)|

# Setup Manual to Enable Automated Features
## Google Sheets
Suggested order of setup:
1. [Curriculum Checklist](#curriculum-checklist) 
2. [College Dashboard](#college-dashboard)
3. [Honors Criteria](#honors-criteria)
### College Dashboard
Suggested order of setup:
1. [Course Code](#course-code)
2. [Academic Period](#period-manual)
3. Grade (if available)

#### Period [MANUAL]
- Description: Academic period taken
- Purpose: Values in `Column B` will serve as a reference to determine the **Status** in the `Curriculum Checklist` sheet.
- Range: `B9:B`
- Setup:
  1. Manually enter the academic period name (e.g. Term 1, Semester 1, Spring Term)
  2. Vertically merge the cells whose rows cover all courses taken during that period. 

#### Course Code [MANUAL]
- Description: Course code taken during academic period (`Column B`).
- Purpose: Values in `Column C` will be used as the search key when updating the curriculum checklist.
> [!IMPORTANT]
> Please ensure that the course code matches its corresponding course code in `'Curriculum Checklist'!B:B`. Update the **Course Code** in both `Curriculum Checklist` and `Academic Dashboard` for equivalent course codes.
- Range: `C9:C`
- Setup:
  1. 
Setup:
1. Manually enter the course code taken during the academic period (as stated in `Column B`).

#### Course Title [AUTOMATIC]
- Description: 
- Range: `D9:D`
- Drag down the formulaReferences the cour 

>[!WARNING]
>The `College Dashboard` sheet will be read by the functions that update the `Curriculum Checklist`. As of `Version 36`, please be advised to **not rename the file**.

#### Course Section [MANUAL]

#### Professor [MANUAL]

#### Units [AUTOMATIC]

#### Grades [MANUAL]
### Honors Criteria

### Curriculum Checklist

### Academic Plan for Remaining Terms

### Term # Dashboard

### Term # Requirements 

## Apps Script, Library Lookup, and Installable Triggers
1. Extensions → Apps Script
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/0040c82a-7018-4b0e-bd38-79c4803ac1de" />

2. Editor → Libraries → Click on the `+` button (tooltip: Add a library). 
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/e3c5e891-3cb0-4347-bd4c-f2b34e3947aa" />

3. In the entry field for the Script ID, paste
```
1EssIuXZXbDp8UjwLK3_VZ5to35blI4RGkbpoaWlDn7igt2YHH-eO9Q4q
```
then click on `Look up`. Select the latest version available.

4. In the entry field for the Identifier, type **ProgressTracker**.
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/0803a364-535f-4804-9ace-b431e7d209e0" />

Click `Add`.

5. Files → Click on the `+` button (Tooltip: Add a file) → Script.
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/323684bf-2727-4111-afc2-198bd8cba9cd" />

6. In the entry field, type **Main** then press. The file name and extension should then be **`Main.gs`**. In the code editor, paste the following:
```
/**
 * @OnlyCurrentDoc
 */

// Public functions for the custom menu.
function onOpen() {
  ProgressTracker.onOpen();
}

function onEdit(e) {
  ProgressTracker.onEdit(e);
}

// Public wrapper to call the library from the menu.
function updateAndShowCoursesSidebar() {
  ProgressTracker.updateAndShowCoursesSidebar();
}

// Public wrapper for the sidebar's client-side call.
function getStoredCourseStatus() {
  return ProgressTracker.getStoredCourseStatus();
  
}
```
7. Click on the save icon (Tooltip: Save project to Drive)

8. Refresh the browser tab of the spreadsheet `Academic Checklist`. The menu bar should now have a new tab called `Utilities`.
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9ebd735d-43e3-4ebc-bd52-850934dc746c" />

> [!IMPORTANT]
> When selecting a sub menu item under `Utilities`, a new window tab will open. Check `Select All` then press `Continue`.
> <img width="1920" height="921" alt="image" src="https://github.com/user-attachments/assets/7ed2f8ca-1dba-4dfe-bc94-13df25a9d841" />

# Version History of ProgressTracker Library
| Version | Deployment | Type of Change | Description |
|---|-------|----------|----------------------------|
| 3 | Sep 1, 2025, 12:06 PM | MINOR | Updated the function descriptions. |
| 4 | Sep 1, 2025, 9:33 PM | MINOR | Instead of "TAKEN", the script now returns "PASSED" to ensure clarity, establishing proper word choice for the negation of the "FAILED" status. |
| 5 | Sep 1, 2025, 10:45 PM | MAJOR (New) | Includes a new script that retrieves information from Columns G and I to populate Columns N and O of the OVERVIEW section. |
| 6 | Sep 2, 2025, 6:06 PM | MAJOR (Patch) | Fixed the incorrect prerequisites not met (not passed) for failed soft prerequisites. |
| 7 | Sep 6, 2025, 4:41 PM | MAJOR (Patch) | The previous code read data from the spreadsheet one cell at a time inside a loop, which led to an extremely inefficient process (approximately 10 minutes) because each read operation was a separate call to the Google server, which added a lot of overhead. In the updated algorithm, it first reads all the necessary data from both the `Curriculum Checklist` and the `College Dashboard` into memory then performs calculations in memory. Finally, the script writes the completed status Column back to the Curriculum Checklist sheet in a single, batch operation, reducing the total runtime from minutes to seconds. |
| 8 | Sep 7, 2025, 12:32 AM | MAJOR (Patch) | The sidebar containing the course status now correctly follows the order of appearance of academic periods from Column C of the Curriculum Checklist through following the order of elements in an array of periods. |
