
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

* To show a list of all available endpoints: `python3 manage.py show_urls`
* If you change the models, you'll need to make migrations: `python3 manage.py makemigrations` after that you'll need to migrate again: `python3 manage.py migrate` before you can run the server again `python3 manage.py runserver`.

#### CRUD operations

* Create: `POST` to the endpoint.
* Read: `GET` to the endpoint.
* Update: `PUT` to the endpoint.
* Delete: `DELETE` to the endpoint.

#### API endpoints

* Detail views are for a single object and list views are for a list of objects.
  * For example `http://127.0.0.1:8000/api/records/` is a list view for all records and `http://127.0.0.1:8000/api/records/1/` is a detail view for the record with the id of 1.
* Send data in json format in the body of the request where applicable.

#### Filtering and searching

* To filter add `?<field>=<value>` to the end of the API url.
  * Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension`
  * This will filter all records for the team with the team_name 'Suspension'. (since the team is a foreign key, to the Teams table you need to use the double underscore notation to access the team_name field of the team object.)
* To search add `?search=<query>` to the end of the API url.
  * Example: `http://127.0.0.1:8000/api/records/?search=dashboard`  
  * This will search all records for the query string 'dashboard'.
* To filter and search add both to the end of the API url with a `&` between.
  * Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension&search=brakes`
  * This will filter all records for the team with the team_name 'Suspension' and then search the results for the query string 'brakes'.
  * Note: the order of the filter and search doesn't matter: `http://127.0.0.1:8000/api/records/?search=shocks&team__team_name=Suspension` will give the same results.
* To filter on multiple fields add another `&<field>=<value>` to the end of the API url.
  * Example: `http://127.0.0.1:8000/api/records/?team__team_name=Suspension&subsystem__subsystem_name=Shocks`
* To change what fields can be searched or filtered you can edit `search_fields` or `filterset_fields` variables in views.py on a per view basis.

#### Pagination

* Pagination implemented using the django rest framework pagination class.
* Default page size is currently 20, this can be changed by altering `PAGE_SIZE` in settings.py.
* API calls now return a `next` and `previous` link in the response headers. As well as a `count` of the total number of objects.
* Data is now returned in a `results` array.
* Example: `http://127.0.0.1:8000/api/users/?page=2` will return the second page of users.
* This can be combined with filtering and searching.

#### Authentication

TODO

### Run for Production

TODO
