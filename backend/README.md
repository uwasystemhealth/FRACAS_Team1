
# FRACAS Backend

## Django rest API backend

### Run local

How to get the backend running locally:

DEBUG is turned on and the database is sqlite3 for now.

1. Install python3 and pip3
2. Install virtualenv: `pip3 install virtualenv`
3. clone this repo.
4. cd into the backend directory: `cd backend`
5. Create a virtual environment: `virtualenv .venv`
6. Activate the virtual environment: `source .venv/bin/activate`
7. Install dependencies: `pip3 install -r requirements.txt`
8. migrate the database: `python3 manage.py migrate`
9. Create superuser: `python3 manage.py createsuperuser`
10. Run the server: `python3 manage.py runserver`
11. Open the browser and go to: `http://localhost:8000/api/`


### Run for production

TODO