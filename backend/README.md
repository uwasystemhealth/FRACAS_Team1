
# FRACAS Backend

## Django rest API backend

### Run Locally

How to get the backend running locally:

DEBUG is turned on and the database is sqlite3 for now.

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

Helpful tips / commands:  
* To show a list of all available endpoints: `python3 manage.py show_urls`
* If you change the models, you'll need to make migrations: `python3 manage.py makemigrations` after that you'll need to migrate again: `python3 manage.py migrate` before you can run the server again `python3 manage.py runserver`.

### Run for Production

TODO