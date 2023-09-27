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

#### CRUD operations

Team leads are admins and have CRUD permissions over all classes.  
A normal user can:

- update and delete his/her own user and records/comments created by him/her.
- create new records, comments.
- read all existing objects.

- Create: `POST` to the endpoint.

- Read: `GET` to the endpoint.
- Update: `PUT` to the endpoint.
  - Record update
    - Endpoint: `/api/records/<int:record_id>/`, where record_id refers to the record object to be updated. e.g. `http://127.0.0.1:8000/api/records/8/`
    - Header: see Authentication header.
    - Body: new record content in JSON format like `{"record_creator": 1, ...}`.
    - Response
      - Success: HTTP `200` with an updated record in JSON format.
      - Field value error: HTTP `400` with field-specific error message.
      - Permission denied: HTTP `403` with response `{"detail": "You do not have permission to perform this action."}`
  - Comment update
    - Endpoint: `/api/comments/<int:comment_id>/`, where comment_id refers to the comment object to be updated. e.g. `http://127.0.0.1:8000/api/comments/1/`
    - Header: see Authentication header.
    - Body: new record content in JSON format like `{"comment_text": "233", ...}`.
    - Response
      - Success: HTTP `200` with an updated comment in JSON format.
      - Field value error: HTTP `400` with field-specific error message.
      - Permission denied: HTTP `403` with response `{"detail": "You do not have permission to perform this action."}`
- Delete: `DELETE` to the endpoint.

#### API endpoints

- Detail views are for a single object and list views are for a list of objects.
  - For example `http://127.0.0.1:8000/api/records/` is a list view for all records and `http://127.0.0.1:8000/api/records/1/` is a detail view for the record with the id of 1.
- Send data in json format in the body of the request where applicable.

#### Filtering and searching

- To filter add `?<field>=<value>` to the end of the API url.
  - Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension`
  - This will filter all records for the team with the team_name 'Suspension'. (since the team is a foreign key, to the Teams table you need to use the double underscore notation to access the team_name field of the team object.)
- To search add `?search=<query>` to the end of the API url.
  - Example: `http://127.0.0.1:8000/api/records/?search=dashboard`
  - This will search all records for the query string 'dashboard'.
- To filter and search add both to the end of the API url with a `&` between.
  - Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension&search=brakes`
  - This will filter all records for the team with the team_name 'Suspension' and then search the results for the query string 'brakes'.
  - Note: the order of the filter and search doesn't matter: `http://127.0.0.1:8000/api/records/?search=shocks&team__team_name=Suspension` will give the same results.
- To filter on multiple fields add another `&<field>=<value>` to the end of the API url.
  - Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension&subsystem__subsystem_name=Shocks`
- To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

#### Pagination

- Pagination implemented using the django rest framework pagination class.
- Default page size is currently 20, this can be changed by altering `PAGE_SIZE` in settings.py.
- API calls now return a `next` and `previous` link in the response headers. As well as a `count` of the total number of objects.
- Data is now returned in a `results` array.
- Example: `http://127.0.0.1:8000/api/users/?page=2` will return the second page of users.
- This can be combined with filtering and searching.

#### Authentication:

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
> | `201`     | `applicatoin/json` | Created user object.          |
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
> | `200`     | `applicatoin/json` | `{"token": <token_string>}`   |
> | `400`     | `applicatoin/json` | Field-specific error message. |

</details>

---

<details>
 <summary><code>POST</code> <code><b>/api/logout</b></code> <code>(logout and delete token)</code></summary>

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
> | `200`     | `applicatoin/json` | `{"message": "Logged out successfully"}`                     |
> | `401`     | `applicatoin/json` | `{"detail":"Invalid token."}`                                |
> | `401`     | `applicatoin/json` | `{"detail":"Authentication credentials were not provided."}` |

</details>

---

### Run for Production

TODO
