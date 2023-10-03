# FRACAS Backend

## Django rest API backend

### Run Locally

#### How to get the backend running locally

1. Install python3 and pip3 if not already done (and sqlite3).
2. Install virtualenv: `pip3 install virtualenv`.
3. Clone this repo.
4. Move into the backend directory: `cd backend`.
5. Create a virtual environment: `python3 -m venv .venv`.
6. Activate the virtual environment: `source .venv/bin/activate`.
7. Install dependencies: `pip3 install -r requirements.txt`.
8. Migrate the database: `python3 manage.py migrate`.
9. Create superuser: `python3 manage.py createsuperuser`.
10. Run the server: `python3 manage.py runserver`.
11. Open the browser and go to: `http://127.0.0.1:8000/api/`.  
    This should show the API root page using the browsable API.
12. You'll need to add some data to the database. Either use the browsable API, the admin interface at `http://127.0.0.1:8000/admin/` or use the API endpoints directly with something like `curl`.

DEBUG is turned on and the database is sqlite3 for now.

#### Helpful tips / commands

- To show a list of all available endpoints: `python3 manage.py show_urls`
- If you change the models, you'll need to make migrations: `python3 manage.py makemigrations` after that you'll need to migrate again: `python3 manage.py migrate` before you can run the server again `python3 manage.py runserver`.

### Authentication

By default, all APIs are protected with token authentication.

<details>
 <summary><code>POST</code> <code><b>/api/register</b></code> <code>(creates a new user)</code></summary>

##### Parameters

> None

##### Request body

data format: JSON object

> | field name | type     | data type | description                           |
> | ---------- | -------- | --------- | ------------------------------------- |
> | email      | required | string    | user login email, cannot be mempty    |
> | first_name | required | string    | user first name, cannot be empty      |
> | last_name  | required | string    | user last name, cannot be empty       |
> | password1  | required | string    | user password, cannot be empty        |
> | password2  | required | string    | repeat user password, cannot be empty |
> | team       | required | string    | user team, can be empty               |

<details>
<summary>Example</summary>

```json
{
  "email": "FRACAS@student.uwa.edu.au",
  "first_name": "Test",
  "last_name": "User",
  "password1": "12345678",
  "password2": "12345678",
  "team": ""
}
```

</details>

##### Responses

> | http code | content-type       | response content              |
> | --------- | ------------------ | ----------------------------- |
> | `201`     | `application/json` | Created user object.          |
> | `500`     | `text/html`        | Field-specific error message. |

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/login</b></code> <code>(login and obtain a token)</code></summary>

##### Parameters

> None

##### Request body

data format: JSON object

> | field name | type     | data type | description                       |
> | ---------- | -------- | --------- | --------------------------------- |
> | username   | required | string    | user login email, cannot be empty |
> | password   | required | string    | user password, cannot be empty    |

<details>
<summary>Example</summary>

```json
{
  "username": "FRACAS@student.uwa.edu.au",
  "password": "12345678"
}
```

</details>

##### Responses

> | http code | content-type       | response content              |
> | --------- | ------------------ | ----------------------------- |
> | `200`     | `application/json` | `{"token": <token_string>}`   |
> | `400`     | `application/json` | Field-specific error message. |

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/logout</b></code> <code>(logout and delete a token)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

None

##### Responses

> | http code | content-type       | response content                                             |
> | --------- | ------------------ | ------------------------------------------------------------ |
> | `200`     | `application/json` | `{"message": "Logged out successfully"}`                     |
> | `401`     | `application/json` | `{"detail":"Invalid token."}`                                |
> | `401`     | `application/json` | `{"detail":"Authentication credentials were not provided."}` |

</details>

---

## Normal User APIs

A normal user can:

- update and delete his/her own user and records/comments created by him/her.
- create new records, comments.
- read all existing objects.

### CREATE

<details>
 <summary><code>POST</code> <code><b>/api/records/</b></code> <code>(creates a new record)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name              | type         | data type    | data format/range    | default value if not specified | description                       |
> | ----------------------- | ------------ | ------------ | -------------------- | ------------------------------ | --------------------------------- |
> | record_creator          | not required | int / string | a positive integer   | null                           | user_id of the record creator     |
> | record_owner            | not required | int / string | a positive integer   | null                           | user_id of the record owner       |
> | team                    | not required | string       |                      | null                           | team name                         |
> | subsystem               | not required | string       |                      | null                           | subsystem name                    |
> | car_year                | not required | int / string |                      | null                           | car year                          |
> | is_deleted              | not required | boolean      | ture/false           | false                          | deletion status                   |
> | status                  | not required | string       |                      | null                           | status string                     |
> | failure_time            | not required | string       | ISO 8601 time format | request submission time        | failure time                      |
> | failure_title           | not required | string       |                      | null                           | failure title                     |
> | failure_impact          | not required | string       |                      | null                           | failure impact                    |
> | failure_cause           | not required | string       |                      | null                           | failure cause                     |
> | failure_mechanism       | not required | string       |                      | null                           | failure mechanism                 |
> | corrective_action_plan  | not required | string       |                      | null                           | corrective action plan            |
> | record_creation_time    | not required | string       | ISO 8601 time format | request submission time        | record creation time              |
> | due_date                | not required | string       | ISO 8601 time format | null                           | record due date                   |
> | resolve_date            | not required | string       | ISO 8601 time format | null                           | record resolve date               |
> | resolution_status       | not required | string       |                      | null                           | record resolve status             |
> | review_date             | not required | string       |                      | null                           | record review date                |
> | is_resolved             | not required | boolean      | true/false           | false                          | record resolve status flag        |
> | is_record_validated     | not required | boolean      | true/false           | false                          | record validation status flag     |
> | is_analysis_validated   | not required | boolean      | true/false           | false                          | analysis validation status flag   |
> | is_correction_validated | not required | boolean      | true/false           | false                          | correction validation status flag |
> | is_reviewed             | not required | boolean      | true/false           | false                          | review status flag                |

<details>
<summary>Example</summary>

```json
{
  "record_creator": 2,
  "record_owner": 3,
  "team": "Team 1",
  "subsystem": "AL",
  "car_year": 2022,
  "is_deleted": false,
  "status": "Record created.",
  "failure_time": "2023-10-03T03:45:35+08:00",
  "failure_title": "Test failure title",
  "failure_description": "Test failure description",
  "failure_impact": "Test failure impact",
  "failure_cause": "Test failure cause",
  "failure_mechanism": "Test failure cause",
  "corrective_action_plan": "Test corrective action plan",
  "record_creation_time": "2023-10-03T03:45:35+08:00",
  "due_date": "2023-10-03T03:48:10+08:00",
  "resolve_date": "2023-10-03T03:48:14+08:00",
  "resolution_status": "Resolved and correction validated, without analysis and review.",
  "review_date": "2023-10-03T03:48:53+08:00",
  "is_resolved": true,
  "is_record_validated": false,
  "is_analysis_validated": false,
  "is_correction_validated": true,
  "is_reviewed": false
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Created record object.                                        |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `500`     | `text/html`        | Field-specific error message.                                 |

##### Successful response

data format: JSON object

> | field name              | data type    | data format/range    | description                       |
> | ----------------------- | ------------ | -------------------- | --------------------------------- |
> | record_creator          | int / string | a positive integer   | user_id of the record creator     |
> | record_owner            | int / string | a positive integer   | user_id of the record owner       |
> | team                    | string       |                      | team name                         |
> | subsystem               | string       |                      | subsystem name                    |
> | car_year                | int / string |                      | car year                          |
> | is_deleted              | boolean      | ture/false           | deletion status                   |
> | status                  | string       |                      | status string                     |
> | failure_time            | string       | ISO 8601 time format | failure time                      |
> | failure_title           | string       |                      | failure title                     |
> | failure_impact          | string       |                      | failure impact                    |
> | failure_cause           | string       |                      | failure cause                     |
> | failure_mechanism       | string       |                      | failure mechanism                 |
> | corrective_action_plan  | string       |                      | corrective action plan            |
> | record_creation_time    | string       | ISO 8601 time format | record creation time              |
> | due_date                | string       | ISO 8601 time format | record due date                   |
> | resolve_date            | string       | ISO 8601 time format | record resolve date               |
> | resolution_status       | string       |                      | record resolve status             |
> | review_date             | string       |                      | record review date                |
> | is_resolved             | boolean      | true/false           | record resolve status flag        |
> | is_record_validated     | boolean      | true/false           | record validation status flag     |
> | is_analysis_validated   | boolean      | true/false           | analysis validation status flag   |
> | is_correction_validated | boolean      | true/false           | correction validation status flag |
> | is_reviewed             | boolean      | true/false           | review status flag                |
> | url                     | string       | URL                  | url to the resource               |
> | record_creator_unlinked | string       |                      | record creator literal name       |
> | record_owner_unlinked   | string       |                      | record owner literal name         |
> | team_unlinked           | string       |                      | team name                         |
> | subsystem_unlinked      | string       |                      | subsystem name                    |

<details>
<summary>Example Response</summary>

```JSON
{
  "record_id": 8,
  "record_creator": 2,
  "record_owner": 3,
  "team": "Team 1",
  "subsystem": "AL",
  "car_year": 2022,
  "url": "http://127.0.0.1:8000/api/records/8/",
  "is_deleted": false,
  "status": "Record created.",
  "record_creator_unlinked": "2",
  "record_owner_unlinked": "3",
  "team_unlinked": "Team 1",
  "subsystem_unlinked": "AL",
  "failure_time": "2023-10-03T03:45:35+08:00",
  "failure_title": "Test failure title",
  "failure_description": "Test failure description",
  "failure_impact": "Test failure impact",
  "failure_cause": "Test failure cause",
  "failure_mechanism": "Test failure cause",
  "corrective_action_plan": "Test corrective action plan",
  "team_lead": "Hello",
  "record_creation_time": "2023-10-03T03:45:35+08:00",
  "due_date": "2023-10-03T03:48:10+08:00",
  "resolve_date": "2023-10-03T03:48:14+08:00",
  "resolution_status": "Resolved and correction validated, without analysis and review.",
  "review_date": "2023-10-03T03:48:53+08:00",
  "is_resolved": true,
  "is_record_validated": false,
  "is_analysis_validated": false,
  "is_correction_validated": true,
  "is_reviewed": false
}
```

</details>

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/comments/</b></code> <code>(creates a new comment)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name        | type          | data type    | data format/range  | description                                |
> | ----------------- | ------------- | ------------ | ------------------ | ------------------------------------------ |
> | comment_text      | required      | string       |                    | comment content                            |
> | record_id         | required      | int / string | a positive integer | record_id of the record to be commented on |
> | commenter         | not required  | int / string | a positive integer | user_id of the commenter                   |
> | parent_comment_id | not required | int / string | a positive integer | comment_id of the parent comment           |

<details>
<summary>Example</summary>

```json
{
  "comment_text": "Some comments",
  "parent_comment_id": null,
  "commenter": 2,
  "record_id": 8
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Created comment object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name        | data type    | data format/range  | description                                |
> | ----------------- | ------------ | ------------------ | ------------------------------------------ |
> | comment_id        | string       |                    | comment id                                 |
> | commenter         | int / string | a positive integer | user_id of the commenter                   |
> | url               | string       | URL                | url to the resource                        |
> | creation_time     | string       | ISO8601 time       | comment time                               |
> | comment_text      | string       |                    | comment content                            |
> | record_id         | int / string | a positive integer | record_id of the record to be commented on |
> | parent_comment_id | int / string | a positive integer | comment_id of the parent comment           |

<details>
<summary>Example Response</summary>

```JSON
{
  "comment_id": 8,
  "commenter": 2,
  "url": "http://127.0.0.1:8000/api/comments/8/",
  "creation_time": "2023-10-03T23:33:57.634094+08:00",
  "comment_text": "Some comments",
  "record_id": 8,
  "parent_comment_id": null
}
```

</details>

</details>

---

### READ

#### Retrieve a single object

<details>
 <summary><code>GET</code> <code><b>/api/records/&ltint:record_id&gt/</b></code> <code>(get a particular record object using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/records/2/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name              | data type    | data format/range    | description                       |
> | ----------------------- | ------------ | -------------------- | --------------------------------- |
> | record_creator          | int / string | a positive integer   | user_id of the record creator     |
> | record_owner            | int / string | a positive integer   | user_id of the record owner       |
> | team                    | string       |                      | team name                         |
> | subsystem               | string       |                      | subsystem name                    |
> | car_year                | int / string |                      | car year                          |
> | is_deleted              | boolean      | ture/false           | deletion status                   |
> | status                  | string       |                      | status string                     |
> | failure_time            | string       | ISO 8601 time format | failure time                      |
> | failure_title           | string       |                      | failure title                     |
> | failure_impact          | string       |                      | failure impact                    |
> | failure_cause           | string       |                      | failure cause                     |
> | failure_mechanism       | string       |                      | failure mechanism                 |
> | corrective_action_plan  | string       |                      | corrective action plan            |
> | record_creation_time    | string       | ISO 8601 time format | record creation time              |
> | due_date                | string       | ISO 8601 time format | record due date                   |
> | resolve_date            | string       | ISO 8601 time format | record resolve date               |
> | resolution_status       | string       |                      | record resolve status             |
> | review_date             | string       |                      | record review date                |
> | is_resolved             | boolean      | true/false           | record resolve status flag        |
> | is_record_validated     | boolean      | true/false           | record validation status flag     |
> | is_analysis_validated   | boolean      | true/false           | analysis validation status flag   |
> | is_correction_validated | boolean      | true/false           | correction validation status flag |
> | is_reviewed             | boolean      | true/false           | review status flag                |
> | url                     | string       | URL                  | url to the resource               |
> | record_creator_unlinked | string       |                      | record creator literal name       |
> | record_owner_unlinked   | string       |                      | record owner literal name         |
> | team_unlinked           | string       |                      | team name                         |
> | subsystem_unlinked      | string       |                      | subsystem name                    |

<details>
<summary>Example Response</summary>

```JSON
{
  "record_id": 8,
  "record_creator": 2,
  "record_owner": 3,
  "team": "Team 1",
  "subsystem": "AL",
  "car_year": 2022,
  "url": "http://127.0.0.1:8000/api/records/8/",
  "is_deleted": false,
  "status": "Record created.",
  "record_creator_unlinked": "2",
  "record_owner_unlinked": "3",
  "team_unlinked": "Team 1",
  "subsystem_unlinked": "AL",
  "failure_time": "2023-10-03T03:45:35+08:00",
  "failure_title": "Test failure title",
  "failure_description": "Test failure description",
  "failure_impact": "Test failure impact",
  "failure_cause": "Test failure cause",
  "failure_mechanism": "Test failure cause",
  "corrective_action_plan": "Test corrective action plan",
  "team_lead": "Hello",
  "record_creation_time": "2023-10-03T03:45:35+08:00",
  "due_date": "2023-10-03T03:48:10+08:00",
  "resolve_date": "2023-10-03T03:48:14+08:00",
  "resolution_status": "Resolved and correction validated, without analysis and review.",
  "review_date": "2023-10-03T03:48:53+08:00",
  "is_resolved": true,
  "is_record_validated": false,
  "is_analysis_validated": false,
  "is_correction_validated": true,
  "is_reviewed": false
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/comments/&ltint:comment_id&gt/</b></code> <code>(get a particular comment object using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/comments/1/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name        | data type | data format/range         | description                                |
> | ----------------- | --------- | ------------------------- | ------------------------------------------ |
> | comment_id        | int       | a positive integer        | comment_id of the comment                  |
> | commenter         | int       | a positive integer / null | user_id of the commenter                   |
> | url               | string    | URL                       | url to the resource                        |
> | creation_time     | string    | ISO 8601 time format      | comment creation time                      |
> | comment_text      | string    |                           | comment content                            |
> | record_id         | int       | URL                       | record_id of the record to be commented on |
> | parent_comment_id | int       | a positive integer / null | comment_id of parent comment               |

<details>
<summary>Example Response</summary>

```JSON
{
  "comment_id": 1,
  "commenter": null,
  "url": "http://127.0.0.1:8000/api/comments/1/",
  "creation_time": "2023-10-03T05:01:09.555475+08:00",
  "comment_text": "Some comments",
  "record_id": 8,
  "parent_comment_id": null
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/cars/&ltint:car_year&gt/</b></code> <code>(get a particular car object using a car year)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/cars/2018/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name   | data type | data format/range  | description         |
> | ------------ | --------- | ------------------ | ------------------- |
> | car_year     | int       | a positive integer | car_year of the car |
> | car_nickname | string    |                    | car nickname        |
> | url          | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "car_year": 2018,
  "car_nickname": "Car A",
  "url": "http://127.0.0.1:8000/api/cars/2018/"
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/subsystems/&ltstr:subsystem_name&gt/</b></code> <code>(get a particular subsystem using a subsystem's name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/subsystems/AL/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name     | data type | data format/range | description         |
> | -------------- | --------- | ----------------- | ------------------- |
> | subsystem_name | string    |                   | subsystem name      |
> | parent_team    | string    |                   | parent team name    |
> | url            | string    | URL               | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "subsystem_name": "AL",
  "parent_team": "Team A",
  "url": "http://127.0.0.1:8000/api/subsystems/AL/"
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/teams/&ltstr:team_name&gt/</b></code> <code>(get a particular team using a team's name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/teams/Team 1/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name | data type | data format/range | description                |
> | ---------- | --------- | ----------------- | -------------------------- |
> | team_name  | string    |                   | team name                  |
> | team_lead  | int       |                   | user_id of the team's lead |
> | url        | string    | URL               | url to the resource        |

<details>
<summary>Example Response</summary>

```JSON
{
  "team_name": "Team 1",
  "team_lead": 2,
  "url": "http://127.0.0.1:8000/api/teams/Team%201/"
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/users/&ltint:user_id&gt/</b></code> <code>(get a particular user object using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/users/2/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                    |

##### Successful response

data format: JSON object

> | field name | data type | data format/range  | description         |
> | ---------- | --------- | ------------------ | ------------------- |
> | user_id    | int       | a positive integer | user_id             |
> | first_name | string    |                    | uesr first name     |
> | last_name  | string    |                    | user last name      |
> | email      | string    | email              | user email          |
> | team       | string    | can be null        | team name           |
> | url        | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "user_id": 2,
  "first_name": "Harry",
  "last_name": "Potter",
  "email": "user1@qq.com",
  "team": null,
  "url": "http://127.0.0.1:8000/api/users/2/"
}
```

</details>

</details>

---

#### Retrieve multiple objects

Note: the format of returned objects in the `results` list field is consistent with the format of retrieved single object.

<details>
 <summary><code>GET</code> <code><b>/api/records/</b></code> <code>(get a page of records)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- record_id
- record_creator\_\_user_id
- record_creator_unlinked
- record_owner\_\_user_id
- record_owner_unlinked
- team\_\_team_name
- team_unlinked
- subsystem\_\_subsystem_name
- subsystem_unlinked
- record_creation_time
- status
- car_year\_\_car_year
- car_year\_\_car_nickname

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/records/?serach=FRACAS?team__team_name=Team1 "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range                | description                                           |
> | ---------- | --------- | -------------------------------- | ----------------------------------------------------- |
> | count      | int       | a positive integer               | total number of records in the database               |
> | next       | string    | URL / null                       | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                       | url to request the previous page, null if at 1st page |
> | results    | list      | a list of record objects in JSON | a list of retrieved records, 20 at the maximum        |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 22,
  "next": "http://127.0.0.1:8000/api/records/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/comments/</b></code> <code>(get a page of comments)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- comment_text
- commenter\_\_user_id

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/comments/?serach=FRACAS?comment_text=Hello+world&search=3 "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range                 | description                                           |
> | ---------- | --------- | --------------------------------- | ----------------------------------------------------- |
> | count      | int       | a positive integer                | total number of comments in the database              |
> | next       | string    | URL / null                        | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                        | url to request the previous page, null if at 1st page |
> | results    | list      | a list of comment objects in JSON | a list of retrieved comments, 20 at the maximum       |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 2,
  "next": "http://127.0.0.1:8000/api/comments/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/cars/</b></code> <code>(get a page of cars)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- car_year
- car_nickname

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/cars/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range             | description                                           |
> | ---------- | --------- | ----------------------------- | ----------------------------------------------------- |
> | count      | int       | a positive integer            | total number of cars in the database                  |
> | next       | string    | URL / null                    | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                    | url to request the previous page, null if at 1st page |
> | results    | list      | a list of car objects in JSON | a list of retrieved cars, 20 at the maximum           |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 2,
  "next": "http://127.0.0.1:8000/api/cars/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/subsystems/</b></code> <code>(get a page of subsystems)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- subsystem_name
- parent_team\_\_team_name

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/subsystems/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range                   | description                                           |
> | ---------- | --------- | ----------------------------------- | ----------------------------------------------------- |
> | count      | int       | a positive integer                  | total number of subsystems in the database            |
> | next       | string    | URL / null                          | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                          | url to request the previous page, null if at 1st page |
> | results    | list      | a list of subsystem objects in JSON | a list of retrieved subsystems, 20 at the maximum     |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 2,
  "next": "http://127.0.0.1:8000/api/subsystems/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/teams/</b></code> <code>(get a page of teams)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- team_name
- team_lead\_\_user_id
- team_lead\_\_email

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/teams/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range              | description                                           |
> | ---------- | --------- | ------------------------------ | ----------------------------------------------------- |
> | count      | int       | a positive integer             | total number of teams in the database                 |
> | next       | string    | URL / null                     | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                     | url to request the previous page, null if at 1st page |
> | results    | list      | a list of team objects in JSON | a list of retrieved teams, 20 at the maximum          |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 2,
  "next": "http://127.0.0.1:8000/api/teams/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

<details>
 <summary><code>GET</code> <code><b>/api/users/</b></code> <code>(get a page of users)</code></summary>

##### Parameters

> | field name     | type         | data type | data format/range  | description                             |
> | -------------- | ------------ | --------- | ------------------ | --------------------------------------- |
> | page           | not required | int       | a positive integer | page number, get page 1 if not provided |
> | search         | not required | string    |                    | serach keyward                          |
> | <filter_field> | not required | string    |                    | filter field                            |

Note: multiple `filter_field` parameters can be provided to apply multiple filters at the same time. The order of the order and search doesn't affect the returned results. To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

Supported filter field names:

- user_id
- email
- team\_\_team_name

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http GET http://127.0.0.1:8000/api/users/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1" page==2"`

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Retrieved response                                            |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `404`     | `application/json` | `{"detail": "Invalid page."}`                                 |

##### Successful response

data format: JSON object

> | field name | data type | data format/range              | description                                           |
> | ---------- | --------- | ------------------------------ | ----------------------------------------------------- |
> | count      | int       | a positive integer             | total number of users in the database                 |
> | next       | string    | URL / null                     | url to request the next page, null if at last page    |
> | previous   | string    | URL / null                     | url to request the previous page, null if at 1st page |
> | results    | list      | a list of user objects in JSON | a list of retrieved users, 20 at the maximum          |

<details>
<summary>Example Response</summary>

Example response when the `page` parameter is not specified (retrieve the 1st page).

```JSON
{
  "count": 2,
  "next": "http://127.0.0.1:8000/api/users/?page=2",
  "previous": null,
  "results": [
    ...
  ]
}
```

</details>

</details>

---

### Update

Note: Only provided fields will be updated.

<details>
 <summary><code>PUT</code> <code><b>/api/records/&ltint:record_id&gt/</b></code> <code>(update a current record created by the user using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name              | type         | data type    | data format/range    | default value if not specified | description                       |
> | ----------------------- | ------------ | ------------ | -------------------- | ------------------------------ | --------------------------------- |
> | record_creator          | not required | int / string | a positive integer   | null                           | user_id of the record creator     |
> | record_owner            | not required | int / string | a positive integer   | null                           | user_id of the record owner       |
> | team                    | not required | string       |                      | null                           | team name                         |
> | subsystem               | not required | string       |                      | null                           | subsystem name                    |
> | car_year                | not required | int / string |                      | null                           | car year                          |
> | is_deleted              | not required | boolean      | ture/false           | false                          | deletion status                   |
> | status                  | not required | string       |                      | null                           | status string                     |
> | failure_time            | not required | string       | ISO 8601 time format | request submission time        | failure time                      |
> | failure_title           | not required | string       |                      | null                           | failure title                     |
> | failure_impact          | not required | string       |                      | null                           | failure impact                    |
> | failure_cause           | not required | string       |                      | null                           | failure cause                     |
> | failure_mechanism       | not required | string       |                      | null                           | failure mechanism                 |
> | corrective_action_plan  | not required | string       |                      | null                           | corrective action plan            |
> | record_creation_time    | not required | string       | ISO 8601 time format | request submission time        | record creation time              |
> | due_date                | not required | string       | ISO 8601 time format | null                           | record due date                   |
> | resolve_date            | not required | string       | ISO 8601 time format | null                           | record resolve date               |
> | resolution_status       | not required | string       |                      | null                           | record resolve status             |
> | review_date             | not required | string       |                      | null                           | record review date                |
> | is_resolved             | not required | boolean      | true/false           | false                          | record resolve status flag        |
> | is_record_validated     | not required | boolean      | true/false           | false                          | record validation status flag     |
> | is_analysis_validated   | not required | boolean      | true/false           | false                          | analysis validation status flag   |
> | is_correction_validated | not required | boolean      | true/false           | false                          | correction validation status flag |
> | is_reviewed             | not required | boolean      | true/false           | false                          | review status flag                |

<details>
<summary>Example</summary>

```json
{
  "record_creator": 2,
  "record_owner": 3,
  "team": "Team 1",
  "subsystem": "AL",
  "car_year": 2022,
  "is_deleted": false,
  "status": "Record created.",
  "failure_time": "2023-10-03T03:45:35+08:00",
  "failure_title": "Test failure title",
  "failure_description": "Test failure description",
  "failure_impact": "Test failure impact",
  "failure_cause": "Test failure cause",
  "failure_mechanism": "Test failure cause",
  "corrective_action_plan": "Test corrective action plan",
  "record_creation_time": "2023-10-03T03:45:35+08:00",
  "due_date": "2023-10-03T03:48:10+08:00",
  "resolve_date": "2023-10-03T03:48:14+08:00",
  "resolution_status": "Resolved and correction validated, without analysis and review.",
  "review_date": "2023-10-03T03:48:53+08:00",
  "is_resolved": true,
  "is_record_validated": false,
  "is_analysis_validated": false,
  "is_correction_validated": true,
  "is_reviewed": false
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Updated record object.                                        |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `403`     | `application/json` | `{"You do not have permission to perform this action."}`      |

##### Successful response

data format: JSON object

> | field name              | data type    | data format/range    | description                       |
> | ----------------------- | ------------ | -------------------- | --------------------------------- |
> | record_creator          | int / string | a positive integer   | user_id of the record creator     |
> | record_owner            | int / string | a positive integer   | user_id of the record owner       |
> | team                    | string       |                      | team name                         |
> | subsystem               | string       |                      | subsystem name                    |
> | car_year                | int / string |                      | car year                          |
> | is_deleted              | boolean      | ture/false           | deletion status                   |
> | status                  | string       |                      | status string                     |
> | failure_time            | string       | ISO 8601 time format | failure time                      |
> | failure_title           | string       |                      | failure title                     |
> | failure_impact          | string       |                      | failure impact                    |
> | failure_cause           | string       |                      | failure cause                     |
> | failure_mechanism       | string       |                      | failure mechanism                 |
> | corrective_action_plan  | string       |                      | corrective action plan            |
> | record_creation_time    | string       | ISO 8601 time format | record creation time              |
> | due_date                | string       | ISO 8601 time format | record due date                   |
> | resolve_date            | string       | ISO 8601 time format | record resolve date               |
> | resolution_status       | string       |                      | record resolve status             |
> | review_date             | string       |                      | record review date                |
> | is_resolved             | boolean      | true/false           | record resolve status flag        |
> | is_record_validated     | boolean      | true/false           | record validation status flag     |
> | is_analysis_validated   | boolean      | true/false           | analysis validation status flag   |
> | is_correction_validated | boolean      | true/false           | correction validation status flag |
> | is_reviewed             | boolean      | true/false           | review status flag                |
> | url                     | string       | URL                  | url to the resource               |
> | record_creator_unlinked | string       |                      | record creator literal name       |
> | record_owner_unlinked   | string       |                      | record owner literal name         |
> | team_unlinked           | string       |                      | team name                         |
> | subsystem_unlinked      | string       |                      | subsystem name                    |

<details>
<summary>Example Response</summary>

```JSON
{
  "record_id": 8,
  "record_creator": 2,
  "record_owner": 3,
  "team": "Team 1",
  "subsystem": "AL",
  "car_year": 2022,
  "url": "http://127.0.0.1:8000/api/records/8/",
  "is_deleted": false,
  "status": "Record created.",
  "record_creator_unlinked": "2",
  "record_owner_unlinked": "3",
  "team_unlinked": "Team 1",
  "subsystem_unlinked": "AL",
  "failure_time": "2023-10-03T03:45:35+08:00",
  "failure_title": "Test failure title",
  "failure_description": "Test failure description",
  "failure_impact": "Test failure impact",
  "failure_cause": "Test failure cause",
  "failure_mechanism": "Test failure cause",
  "corrective_action_plan": "Test corrective action plan",
  "team_lead": "Hello",
  "record_creation_time": "2023-10-03T03:45:35+08:00",
  "due_date": "2023-10-03T03:48:10+08:00",
  "resolve_date": "2023-10-03T03:48:14+08:00",
  "resolution_status": "Resolved and correction validated, without analysis and review.",
  "review_date": "2023-10-03T03:48:53+08:00",
  "is_resolved": true,
  "is_record_validated": false,
  "is_analysis_validated": false,
  "is_correction_validated": true,
  "is_reviewed": false
}
```

</details>

</details>

---

<details>
 <summary><code>PUT</code> <code><b>/api/comments/&ltint:comment_id&gt/</b></code> <code>(update a particular comment object created by user using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name        | type          | data type    | data format/range  | description                                |
> | ----------------- | ------------- | ------------ | ------------------ | ------------------------------------------ |
> | comment_text      | required      | string       |                    | comment content                            |
> | record_id         | required      | int / string | a positive integer | record_id of the record to be commented on |
> | commenter         | not required  | int / string | a positive integer | user_id of the commenter                   |
> | parent_comment_id | not required | int / string | a positive integer | comment_id of the parent comment           |

<details>
<summary>Example</summary>

```json
{
  "comment_text": "Some comments",
  "parent_comment_id": 1,
  "commenter": 2,
  "record_id": 8
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Updated comment object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |
> | `403`     | `application/json` | `{"You do not have permission to perform this action."}`      |

##### Successful response

data format: JSON object

> | field name   | data type | data format/range  | description         |
> | ------------ | --------- | ------------------ | ------------------- |
> | car_year     | int       | a positive integer | car_year of the car |
> | car_nickname | string    |                    | car nickname        |
> | url          | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "car_year": 2018,
  "car_nickname": "Car A",
  "url": "http://127.0.0.1:8000/api/cars/2018/"
}
```

</details>

</details>

---
<details>
 <summary><code>PUT</code> <code><b>/api/users/&ltint:user_id&gt/</b></code> <code>(update own user object using a user's user_id)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name | type     | data type | description                           |
> | ---------- | -------- | --------- | ------------------------------------- |
> | email      | required | string    | user login email    |
> | first_name | not required | string    | user first name     |
> | last_name  | not required | string    | user last name      |
> | team       | not required | string    | user team, can be empty               |

<details>
<summary>Example</summary>

```json
{
  "email": "FRACAS@student.uwa.edu.au",
  "first_name": "Test",
  "last_name": "User2",
  "team": ""
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `200`     | `application/json` | Updated user object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name | data type | data format/range  | description         |
> | ---------- | --------- | ------------------ | ------------------- |
> | user_id    | int       | a positive integer | user_id             |
> | first_name | string    |                    | uesr first name     |
> | last_name  | string    |                    | user last name      |
> | email      | string    | email              | user email          |
> | team       | string    | can be null        | team name           |
> | url        | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "user_id": 4,
  "first_name": "Test'",
  "last_name": "User2",
  "email": "FRACAS@student.uwa.edu.au",
  "team": null,
  "url": "http://127.0.0.1:8000/api/users/4/"
}
```

</details>

</details>

---

### DELETE

<details>
 <summary><code>DELETE</code> <code><b>/api/records/&ltint:record_id&gt/</b></code> <code>(delete a particular record object created by user using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http DELETE http://127.0.0.1:8000/api/records/2/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                                   |
> | --------- | ------------------ | ------------------------------------------------------------------ |
> | `204`     | `application/json` | None                                                               |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}`      |
> | `403`     | `application/json` | `{"detail": "You do not have permission to perform this action."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                         |

</details>

---

<details>
 <summary><code>DELETE</code> <code><b>/api/comments/&ltint:record_id&gt/</b></code> <code>(delete a particular comment object created by user using an ID)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http DELETE http://127.0.0.1:8000/api/comments/2/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                                   |
> | --------- | ------------------ | ------------------------------------------------------------------ |
> | `204`     | `application/json` | None                                                               |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}`      |
> | `403`     | `application/json` | `{"detail": "You do not have permission to perform this action."}` |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                         |

</details>

---

## Admin APIs

An admin user can:

- Create, read, update, and delete all objects freely.

For admin users, Normal User APIs can be used without being the creator of a resource. Apart from Normal User APIs, some APIs can only be used by admin users:

### CREATE

<details>
 <summary><code>POST</code> <code><b>/api/cars/</b></code> <code>(creates a new car)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name   | type         | data type | data format/range  | description                                |
> | ------------ | ------------ | --------- | ------------------ | ------------------------------------------ |
> | car_year     | required     | int       |                    | car year                                   |
> | car_nickname | not required | string    | a positive integer | record_id of the record to be commented on |

<details>
<summary>Example</summary>

```json
{
  "car_year": 2025,
  "car_nickname": "FRACAS-2025"
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Created car object.                                           |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name   | data type | data format/range  | description         |
> | ------------ | --------- | ------------------ | ------------------- |
> | car_year     | int       | a positive integer | car_year of the car |
> | car_nickname | string    |                    | car nickname        |
> | url          | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "car_year": 2025,
  "car_nickname": "FRACAS-2025",
  "url": "http://127.0.0.1:8000/api/cars/2025/"
}
```

</details>

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/cars/</b></code> <code>(creates a new subsystem)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name     | type         | data type | data format/range | description                         |
> | -------------- | ------------ | --------- | ----------------- | ----------------------------------- |
> | subsystem_name | required     | string    |                   | subsystem name                      |
> | parent_team    | not required | string    |                   | team to which the subsystem belongs |

<details>
<summary>Example</summary>

```json
{
  "subsystem_name": "testing",
  "parent_team": "team"
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Created subsystem object.                                     |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name     | data type | data format/range | description                         |
> | -------------- | --------- | ----------------- | ----------------------------------- |
> | subsystem_name | string    |                   | subsystem name                      |
> | parent_team    | string    |                   | team to which the subsystem belongs |
> | url            | string    | URL               | url to the resource                 |

<details>
<summary>Example Response</summary>

```JSON
{
  "subsystem_name": "testing",
  "parent_team": "team",
  "url": "http://127.0.0.1:8000/api/subsystems/testing/"
}
```

</details>

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/teams/</b></code> <code>(creates a new team)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name | type         | data type | data format/range  | description               |
> | ---------- | ------------ | --------- | ------------------ | ------------------------- |
> | team_name  | required     | string    |                    | team name                 |
> | team_lead  | not required | int       | a positive integer | user_id of team lead user |

<details>
<summary>Example</summary>

```json
{
  "team_name": "team6",
  "team_lead": 1
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Created subsystem object.                                     |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name | data type | data format/range  | description               |
> | ---------- | --------- | ------------------ | ------------------------- |
> | team_name  | string    |                    | team name                 |
> | team_lead  | int       | a positive integer | user_id of team lead user |
> | url        | string    | URL                | url to the resource       |

<details>
<summary>Example Response</summary>

```JSON
{
  "team_name": "team6",
  "team_lead": 1,
  "url": "http://127.0.0.1:8000/api/teams/team6/"
}
```

</details>

</details>

---

### UPDATE

Note: Only provided fields will be updated.

<details>
 <summary><code>PUT</code> <code><b>/api/cars/&ltint:car_year&gt/</b></code> <code>(update a particular car object using a car year)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name   | type         | data type | data format/range  | description                                |
> | ------------ | ------------ | --------- | ------------------ | ------------------------------------------ |
> | car_year     | required     | int       |                    | car year                                   |
> | car_nickname | not required | string    | a positive integer | record_id of the record to be commented on |
<details>
<summary>Example</summary>

```json
{
  "car_year": 2025,
  "car_nickname": "FRACAS-2025"
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Updated car object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name   | data type | data format/range  | description         |
> | ------------ | --------- | ------------------ | ------------------- |
> | car_year     | int       | a positive integer | car_year of the car |
> | car_nickname | string    |                    | car nickname        |
> | url          | string    | URL                | url to the resource |

<details>
<summary>Example Response</summary>

```JSON
{
  "car_year": 2018,
  "car_nickname": "Car A",
  "url": "http://127.0.0.1:8000/api/cars/2018/"
}
```

</details>

</details>

---

<details>
 <summary><code>PUT</code> <code><b>/api/subsystems/&ltstr:subsystem_name&gt/</b></code> <code>(update a particular subsystem object using a subsystem's name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name     | type         | data type | data format/range | description                         |
> | -------------- | ------------ | --------- | ----------------- | ----------------------------------- |
> | subsystem_name | required     | string    |                   | subsystem name                      |
> | parent_team    | not required | string    |                   | team to which the subsystem belongs |

<details>
<summary>Example</summary>

```json
{
  "subsystem_name": "testing",
  "parent_team": "team"
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Updated subsystem object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name     | data type | data format/range | description                         |
> | -------------- | --------- | ----------------- | ----------------------------------- |
> | subsystem_name | string    |                   | subsystem name                      |
> | parent_team    | string    |                   | team to which the subsystem belongs |
> | url            | string    | URL               | url to the resource                 |

<details>
<summary>Example Response</summary>

```JSON
{
  "subsystem_name": "testing",
  "parent_team": "team",
  "url": "http://127.0.0.1:8000/api/subsystems/testing/"
}
```

</details>

</details>

---

<details>
 <summary><code>PUT</code> <code><b>/api/teams/&ltstr:team_name&gt/</b></code> <code>(update a particular team object using a team's name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

data format: JSON object

> | field name | type         | data type | data format/range  | description               |
> | ---------- | ------------ | --------- | ------------------ | ------------------------- |
> | team_name  | required     | string    |                    | team name                 |
> | team_lead  | not required | int       | a positive integer | user_id of team lead user |

<details>
<summary>Example</summary>

```json
{
  "team_name": "team6",
  "team_lead": 1
}
```

</details>

##### Responses

> | http code | content-type       | response content                                              |
> | --------- | ------------------ | ------------------------------------------------------------- |
> | `201`     | `application/json` | Updated team object.                                       |
> | `400`     | `application/json` | Field-specific error message.                                 |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}` |

##### Successful response

data format: JSON object

> | field name | data type | data format/range  | description               |
> | ---------- | --------- | ------------------ | ------------------------- |
> | team_name  | string    |                    | team name                 |
> | team_lead  | int       | a positive integer | user_id of team lead user |
> | url        | string    | URL                | url to the resource       |

<details>
<summary>Example Response</summary>

```JSON
{
  "team_name": "team6",
  "team_lead": 1,
  "url": "http://127.0.0.1:8000/api/teams/team6/"
}
```

</details>

</details>

---



### DELETE
<details>
 <summary><code>DELETE</code> <code><b>/api/cars/&ltint:car_year&gt/</b></code> <code>(delete a particular car object using a car year)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http DELETE http://127.0.0.1:8000/api/cars/2/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                                   |
> | --------- | ------------------ | ------------------------------------------------------------------ |
> | `204`     | `application/json` | None                                                               |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}`      |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                         |

</details>

---
<details>
 <summary><code>DELETE</code> <code><b>/api/subsystems/&ltstr:subsystem_name&gt/</b></code> <code>(delete a particular team object using a name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http DELETE http://127.0.0.1:8000/api/subsystems/AL/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                                   |
> | --------- | ------------------ | ------------------------------------------------------------------ |
> | `204`     | `application/json` | None                                                               |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}`      |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                         |

</details>

---

<details>
 <summary><code>DELETE</code> <code><b>/api/teams/&ltstr:team_name&gt/</b></code> <code>(delete a particular team object using a name)</code></summary>

##### Parameters

> None

##### Request header

> | name            | value                  |
> | --------------- | ---------------------- |
> | `Authorization` | `Token <token_string>` |

##### Request body

> None

<details>
<summary>Example</summary>

Using HTTPie:  
`http DELETE http://127.0.0.1:8000/api/teams/team6/ "Authorization: Token e999db2e85b1e97efbf67c450b5da04c943855f1"`

</details>

##### Responses

> | http code | content-type       | response content                                                   |
> | --------- | ------------------ | ------------------------------------------------------------------ |
> | `204`     | `application/json` | None                                                               |
> | `401`     | `application/json` | `{"detail": "Authentication credentials were not provided."}`      |
> | `404`     | `application/json` | `{"detail": "Not found."}`                                         |

</details>

---


## Run for Production

TODO
