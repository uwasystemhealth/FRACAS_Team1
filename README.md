# FRACAS Team 1

# Introduction

<details>
<summary style="font-size: 24px;">About</summary>

As part of the Master's in Information Technology Capstone unit (CITS5206), we are working with the University of Western Australia Motorsport club (UWAM) to develop a Failure, Reporting, Analysis and Corrective Action System (FRACAS).  

The FRACAS for UWA Motorsport shall serve primarily as a means of recording and transferring knowledge of failures and what corrective actions were taken in response. Due to a lack of a comparable system, UWAM is seeking to eliminate the inefficiencies they are experiencing while transferring experience and technical knowledge to new members. This is exacerbated by the fact that UWAM is a student-led club, with members graduating and leaving the club every year.  

The FRACAS will be developed using the Agile methodology, with the project being broken down into 3 sprints. The first sprint will focus on developing a mock up  of the FRACAS Minimum Viable Product and refining specifications in regards to client's intentions. The second sprint entails creating a working prototype of the MVP. Lastly, the third sprint focuses on adding additional features and testing the system.  

The FRACAS will be implemented using the Django web framework, with the system being hosted on the AWS cloud platform. The system will be developed using the Python programming language, with the front-end being developed using HTML, CSS and JavaScript. Data will be stored in a PostgreSQL database. The application will be available to users via a web browser on a desktop computer or mobile device.  

</details>

<details>
<summary style="font-size: 24px;">Project Background</summary>

The University of Western Australia Motorsport club (UWAM) is a student-led club that competes annually in the FSAE-Australasia student design competition. This competition involves designing, building and racing a formula-style racecar. UWAM is inefficient at transferring experience and technical knowledge from competent members such as current Team Leads to new members.  

This project aims to build and test a Failure, Reporting, Analysis and Corrective Action System (FRACAS) for UWAM.  

This system will serve as an element of a greater knowledge management and transfer system, allowing current and future members to see records of past failures and how they were dealt with. Our intention is that this knowledge capture system can improve UWAM's scheduling, budgeting, management, vehicle testing, and the focus of future design efforts.  

A requirements documents has already been developed as part of a BPhil 2nd year project. The clients are Erwin Bauernschmitt from UWAM and Prof Melinda Hodkiewicz (a maintenance and reliability engineer). A copy of the requirements document is available here.  

</details>

---

## Clients

Professor Melinda Hodkiewicz, Erwin Bauernschmitt and the UWAM.  

## Team Members

CITS5206 Group 10: [James Braunagel](https://github.com/jp-braun), [Wenbo Gao](https://github.com/JohnnyGao1997), [Stanley Ser](https://github.com/stanleyfluke), [Sachin Thekkooden](https://github.com/sj9612), and [Yanchen Zhao](https://github.com/VictorAZ12).

---

## Key Features

Normal users in the FRACAS system can:
* A user can create a new account
* A user can create a new failure report
* A user can view a list of all failure reports
* A user can search for a failure report
* A user can view a failure report
* A user can edit failure reports which have the user in the editors list and/or created by the user


A team lead can do everything a user can do and:
* A team lead can assign users to a team
* A team lead can change the resolve and validation statuses of records

Admin features:
An admin can do everything a team lead can do and:
* An admin can log into the admin site of the FRACAS system
* An admin can modify reocrds, users, teams, cars, teams, subsystems in the admin site
* An admin can approve a user to activate the user's account

---

## Demonstration deployment
- Website: [FRACAS site](http://54.253.142.8/)  
- Admin site: [Admin site](http://54.253.142.8/admin)

Please contact developers for credentials.

# User Manual

## User registration, activation, and permission change
### Normal user registration
- Click the "Sign up" button in the navigation bar to the top right of the website.
- Fill in the user details, then click "Register".
- Click the link received in the user registration email inbox to verify the new account.
- Contact an admin user to activate the newly verified account from the admin site.

A normal user can only use the site after the account is both email-verified and activated by the admin.  

### Admin user addition
- Log into admin site using an admin account.
- Click the Add button next to the Users row.
- Fill in user detaills, then click "save".

### Admin user permission change
User properties in the Admin site:
- Email Verified: registration email is verified, cannot log in unless also approved.
- Approved: approved by an admin user, cannot log in unless also email verified.
- Team Lead: has permission to modify record resolve and validation statuses.
- Admin: has permission to log in the admin site. 

Change permission:
- Log into admin site using an admin account.
- Click the Users hyperlink, then select a user to modify.
- Additionally, tick multiple checkboxes to select multiple users, then expand the Action dropdown menu to selct an action to be applied on the selected users. Click Go to confirm.

Please note: the actions "Approve/Disapprove" change the "Approved" attribute and essentially activate/deactivate the account.  

## User dashboard
3 buttons are provided, which are "Submit Report", "Search Reports", and "Log out".  
- Submit Report: create a new report to submit.
- Search Report: search for an existing report using keyword and/or filters.
- Log out: log out.

In the top-right navigation bar, the user is provided with a few buttons as well. The buttons will trigger the corresponding functionalities.
## Submit Report
- The report creation page provides some fields to be filled. The submit button is located at the bottom of the page. A new report can be submitted after some key fields are filled.  
- Click on the triangle button below "Additional Data Folder" to fill some additional data. You can add other users as record editors if you have the editing permission.  
## Search Report
- Type keywords in the input box, then click Search to search.
- Click Clear Search to return to the intial state.
- Pagination buttons will be enabled when more than 20 results are returned in one search.
