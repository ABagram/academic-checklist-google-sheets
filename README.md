# Academic Checklist
The google sheet template allows students to track their academic progress throughout their stay in the institution, supporting different academic period types while the script automates the calculation process for the course status in the "Curriculum Checklist" and eligibility for honors in the "College Dashboard".

## Features
- Templates
  - |`Sheet Name`| Description`|
    |-------------|--------------|
  - |`College Dashboard`|All information related to student's current academic standing are included in this sheet. 
  - `Honors Criteria`
      By default, the honors criteria are set according to the requirements stated in the [De La Salle University (DLSU) Student Handbook for Academic Year 2021-2025](https://www.dlsu.edu.ph/wp-content/uploads/pdf/osa/student-handbook.pdf)
  - `Curriculum Checklist`
  - `{Academic Period #} Dashboard` (Default: Term # Dashboard)
  - `{Academic Period #} Requirements` (Default: Term # Requirements)
- Automatic
  - |Feature|Dependencies|
    |-------|------------|
    |Curriculum Audit||
    |Course Status Summary||
    |Current Week Calculation and Visualization|Sheets that contain "Weekly Schedule" in their name (e.g.  `Term 10 Weekly Schedule`)|
    |Weekly Schedule Visualization|Sheets that contain "Weekly Schedule" in their name (e.g.  `Term 10 Weekly Schedule`)|

# Setup Manual
## Google Sheets
### College Dashboard

#### Academic Period
Description: Values in `column B` will serve as a reference to determine the course status in the `Curriculum Checklist`.

Range: `B9:B`

Setup:
1. Manually enter the academic period name (e.g. Term 1, Semester 1, Spring Term)
2. Vertically merge the cells whose rows cover all courses taken during that period. 

#### Course Code
Description: Values in `column C` will be used as the search key when updating the curriculum checklist. Please ensure that the course code matches its corresponding course code in `'Curriculum Checklist'!B:B`.

Range: `C9:C`

Setup:
1. Manually enter the course code taken during the academic period (as stated in `column B`).

#### Course Title
| D9:D| Course Title| Copy paste or drag down the formulaReferences the cour 

>[!WARNING]
>The `College Dashboard` sheet will be read by the functions that update the `Curriculum Checklist`. As of `Version 36`, please be advised to **not rename the file**.

## Honors Criteria

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

4. In the entry field for the Identifier, type **ProgressTracker** incase the default is different.
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/0803a364-535f-4804-9ace-b431e7d209e0" />

Click `Add`.

Files → Click on the `+` button (tooltip: Add a file) → Script.
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/323684bf-2727-4111-afc2-198bd8cba9cd" />
In the entry field, type **main** then press. In the code editor, paste the following:
```
function updateCurriculumChecklist() {
  ProgressTracker.updateCurriculumChecklist();
}

function updateToDoList(e) {
  ProgressTracker.onEdit(e);
}

function updateOverviewOnDashboard(){
  ProgressTracker.updateOverviewOnDashboard();
}
```
Click on the save icon (tooltip: Save project to Drive)
<img width="1920" height="827" alt="image" src="https://github.com/user-attachments/assets/90b3f571-e344-425b-aab6-6d6eeb19d744" />

Apps Script → Triggers


# Version History of ProgressTracker Library
| Version | Deployment | Type of Change | Description |
|---|-------|----------|----------------------------|
| 3 | Sep 1, 2025, 12:06 PM | MINOR | Updated the function descriptions. |
| 4 | Sep 1, 2025, 9:33 PM | MINOR | Instead of "TAKEN", the script now returns "PASSED" to ensure clarity, establishing proper word choice for the negation of the "FAILED" status. |
| 5 | Sep 1, 2025, 10:45 PM | MAJOR (New) | Includes a new script that retrieves information from columns G and I to populate columns N and O of the OVERVIEW section. |
| 6 | Sep 2, 2025, 6:06 PM | MAJOR (Patch) | Fixed the incorrect prerequisites not met (not passed) for failed soft prerequisites. |
| 7 | Sep 6, 2025, 4:41 PM | MAJOR (Patch) | The previous code read data from the spreadsheet one cell at a time inside a loop, which led to an extremely inefficient process (approximately 10 minutes) because each read operation was a separate call to the Google server, which added a lot of overhead. In the updated algorithm, it first reads all the necessary data from both the `Curriculum Checklist` and the `College Dashboard` into memory then performs calculations in memory. Finally, the script writes the completed status column back to the Curriculum Checklist sheet in a single, batch operation, reducing the total runtime from minutes to seconds. |
| 8 | Sep 7, 2025, 12:32 AM | MAJOR (Patch) | The sidebar containing the course status now correctly follows the order of appearance of academic periods from column C of the Curriculum Checklist through following the order of elements in an array of periods. |
