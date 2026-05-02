# Academic Checklist
The google sheet template allows students to track their academic progress throughout their stay in an academic institution, supporting different academic period types while the script automates the calculation process for the course status in the "Curriculum Checklist" and eligibility for honors in the "College Dashboard".

## Templates
| Sheet Name    | Description |
| ------------- |-------------- |
|`College Dashboard`|All information related to student's current academic standing are included in this sheet.|
|`Honors Criteria`|By default, the honors criteria are set according to the requirements stated in the [De La Salle University (DLSU) Student Handbook for Academic Year 2021-2025](https://www.dlsu.edu.ph/wp-content/uploads/pdf/osa/student-handbook.pdf). This may be updated as needed.|
|`Curriculum Checklist`||
|`{Academic Period #} Dashboard`| (Default: Term # Dashboard. Note: Change the `#` into the actual semester/term number followed. Since this is controlled by a script, make sure to follow the format properly.)|
|`{Academic Period #} Requirements`| (Default: Term # Requirements. Note: Change the `#` into the actual semester/term number followed. Since this is controlled by a script, make sure to follow the format properly.)|

## Automated Features
### Curriculum Audit
- Utilizes manually-entered data in `College Dashboard` to determine course status.
  |Sample Status|Interpretation|
  |-------------|--------------|
  |Prerequisites Not Met: THSMFE1 (Not Passed)|If the course has hard prerequisites that have not been passed, the Status will indicate "Not Passed" along with the corresponding course code of the prerequisites.|
  |Prerequisites Not Met: LBYMF3A (Not Taken)|If the course has soft prerequisites that have not been taken, the Status will indicate "Not Taken" along with the corresponding course code of the prerequisites.|
  |READY|If the course is ready to be enlisted (i.e. all prerequisites have been met), the Status will indicate "READY". Note that due to lack of information on course offerings, the script assumes that the course is offered every term.|
  |ENROLLED|If the latest instance of the course code is found with no corresponding grade, the script assumes that it is currently enrolled.|
  |PASSED (TERM 9)|If the course has been passed (grade of > 0.0 or "PASSED"), the Status will indicate "PASSED (PERIOD when it was passed based on College Dashboard)".|
  |FAILED (TERM 9)|If the grade is 0.0 or "FAILED", the Status will indicated "FAILED (PERIOD WHEN COURSE WAS LAST TAKEN based on College Dashboard)".|
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

# Setup Manual
## Google Sheets
### College Dashboard

Format:
|Row #|B|C|D|E|F|G|H|
|-----|-|-|-|-|-|-|-|
|8||||||||
|9|Academic Period|Course Code|Course Title|Course Section|Professor|Units|Grade|

#### Period [MANUAL]
- Description: Values in `column B` will serve as a reference to determine the **Status** in the `Curriculum Checklist` sheet.
- Range: `B9:B`
- Setup:
  1. Manually enter the academic period name (e.g. Term 1, Semester 1, Spring Term)
  2. Vertically merge the cells whose rows cover all courses taken during that period. 


Description: Values in `column C` will be used as the search key when updating the curriculum checklist. Please ensure that the course code matches its corresponding course code in `'Curriculum Checklist'!B:B`.

- Range(s):
  - `E

Setup:
1. Manually enter the course code taken during the academic period (as stated in `column B`).

#### Course Title [AUTOMATIC]
- Range: `D9:D`
Copy paste or drag down the formulaReferences the cour 

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
| 5 | Sep 1, 2025, 10:45 PM | MAJOR (New) | Includes a new script that retrieves information from columns G and I to populate columns N and O of the OVERVIEW section. |
| 6 | Sep 2, 2025, 6:06 PM | MAJOR (Patch) | Fixed the incorrect prerequisites not met (not passed) for failed soft prerequisites. |
| 7 | Sep 6, 2025, 4:41 PM | MAJOR (Patch) | The previous code read data from the spreadsheet one cell at a time inside a loop, which led to an extremely inefficient process (approximately 10 minutes) because each read operation was a separate call to the Google server, which added a lot of overhead. In the updated algorithm, it first reads all the necessary data from both the `Curriculum Checklist` and the `College Dashboard` into memory then performs calculations in memory. Finally, the script writes the completed status column back to the Curriculum Checklist sheet in a single, batch operation, reducing the total runtime from minutes to seconds. |
| 8 | Sep 7, 2025, 12:32 AM | MAJOR (Patch) | The sidebar containing the course status now correctly follows the order of appearance of academic periods from column C of the Curriculum Checklist through following the order of elements in an array of periods. |
