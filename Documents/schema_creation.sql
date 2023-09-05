/*
	FRACAS DB schema creation script
	This script creates the FRACAS database Postgres schema described in 
	https://drive.google.com/file/d/1P7sldDpkZWKb0iMdXkCrG1xOWWRXEDt4/view?usp=sharing
	in the connected database.
	Logic:.
		1. Create the schema "FRACAS" if it doesn't exist
		2. Create tables and columns (NULL is enabled by default) if they don't exist
		3. Add relationships and constraints if they don't exist
	@author Yanchen Zhao
	@version 1.0 05/09/23
*/



-- Create schema "FRACAS" if it doesn't exists
BEGIN;
		CREATE SCHEMA IF NOT EXISTS FRACAS;
COMMIT;

/*
	Creation of tables.
	Order:
		users
		teams
			teams.teamLead -> users.userID
		in_team
			in_team.userID -> users.userID
			in_team.teamID -> teams.teamID
		categories
			categories.parentCategory -> categories.categoryID
		records
			records.recordCreator -> users.userID
			records.recordOwner -> users.userID
			records.teamLead -> users.userID
			records.category -> categories.categoryID
			records.subcategory -> categories.categoryID
			records.technicalTeam -> teams.teamID
		user_record_mapping
			user_record_mapping.userID -> users.userID
			user_record_mapping.recordID -> records.recordID
		comments
			comments.parentCommentID -> comments.commentID
			comments.commenter -> users.userID
			comments.recordID -> records.recordID	
*/

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.users(
	userID serial PRIMARY KEY,
	userName text,
	contact text
	);
COMMIT;

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.teams(
	teamID serial PRIMARY KEY,
	teamLead int,
	teamName text,
	CONSTRAINT fk_teams_lead
		FOREIGN KEY (teamLead)
			REFERENCES FRACAS.users(userID)
			ON DELETE SET NULL
			ON UPDATE CASCADE
	);
COMMIT;

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.in_team(
	in_team_ID serial PRIMARY KEY,
	userID int,
	teamID int,
	CONSTRAINT fk_in_team_users
		FOREIGN KEY (userID)
			REFERENCES FRACAS.users(userID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	CONSTRAINT fk_in_team_teams
		FOREIGN KEY (teamID)
			REFERENCES FRACAS.teams(teamID)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);
COMMIT;

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.categories(
	categoryID serial PRIMARY KEY,
	category text,
	parentCategory int,
	CONSTRAINT fk_categories_parentCategories
		FOREIGN KEY (parentCategory)
			REFERENCES FRACAS.categories(categoryID)
			ON DELETE SET NULL
			ON UPDATE CASCADE
	);
COMMIT;

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.records(
	recordID serial PRIMARY KEY,
	isDeleted boolean,
	status text,
	creationTime timestamp, -- Based in WA, timezone is ignored
	recordCreator int,
	recordOwner int,
	technicalTeam int,
	subsystem text,
	carYear text,
	failureTime timestamp,
	failureTitle text,
	failureDescription text,
	failureImpact text,
	failureCause text,
	failureMechanism text,
	responseActionPlan text,
	correctiveActionPlan text,
	resolutionStatus text,
	teamLead int,
	reviewDate timestamp,
	reportCreationTime timestamp,
	dueDate timestamp,
	isResolved boolean,
	resolveDate timestamp,
	isRecordValidated boolean,
	isAnalysisValidated boolean,
	isCorrectionValidated boolean,
	isReviewed boolean,
	category int,
	subcategory int,
	CONSTRAINT fk_records_recordCreator
		FOREIGN KEY (recordCreator)
			REFERENCES FRACAS.users(userID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_records_recordOwner
		FOREIGN KEY (recordOwner)
			REFERENCES FRACAS.users(userID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_records_teamLead
		FOREIGN KEY (teamLead)
			REFERENCES FRACAS.users(userID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_records_categories
		FOREIGN KEY (category)
			REFERENCES FRACAS.categories(categoryID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_records_subcategory
		FOREIGN KEY (subcategory)
			REFERENCES FRACAS.categories(categoryID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_records_teams
		FOREIGN KEY (technicalTeam)
			REFERENCES FRACAS.teams(teamID)
			ON DELETE SET NULL
			ON UPDATE CASCADE
	);
COMMIT;


BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.user_record_mapping(
	mappingID serial PRIMARY KEY,
	userID int,
	recordID int,
	mappingType int,
	creationTime timestamp,
	CONSTRAINT fk_user_record_mapping_users
		FOREIGN KEY (userID)
			REFERENCES FRACAS.users(userID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	CONSTRAINT fk_user_record_mapping_records
		FOREIGN KEY (recordID)
			REFERENCES FRACAS.records(recordID)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);
COMMIT;

BEGIN;
CREATE TABLE IF NOT EXISTS FRACAS.comments(
	commentID serial PRIMARY KEY,
	recordID int,
	parentCommentID int,
	commenter int,
	creationTime timestamp,
	commentText text,
	CONSTRAINT fk_comments_parentComments
		FOREIGN KEY (parentCommentID)
			REFERENCES FRACAS.comments(commentID)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
	CONSTRAINT fk_comments_users
		FOREIGN KEY (commenter)
			REFERENCES FRACAS.users(userID)
			ON DELETE SET NULL
			ON UPDATE CASCADE,
	CONSTRAINT fk_comments_records
		FOREIGN KEY (recordID)
			REFERENCES FRACAS.records(recordID)
			ON DELETE CASCADE
			ON UPDATE CASCADE
	);
COMMIT;



