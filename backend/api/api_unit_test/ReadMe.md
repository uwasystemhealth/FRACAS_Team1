# Testing Guide

This document provides instructions on how to run the unit tests and generate a coverage report for the `api` files.

## Setting Up

1. **Ensure Python Installation**:
   - Verify that you have Python 3.8 or newer installed on your machine by running the command: 
     ```bash
     python --version
     ```

2. **Create and Activate Virtual Environment**:
   - Move into the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python3 -m venv .venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       .venv\Scripts\activate
       ```
     - On macOS and Linux:
       ```bash
       source .venv/bin/activate
       ```

3. **Install Dependencies**:
   - Install the necessary packages from the `requirements.txt` file:
     ```bash
     pip install -r requirements.txt
     ```

    **Note**: If `pytest` and `pytest-cov` are not included in your `requirements.txt`, you can install them using the following command:
    ```bash
    pip install pytest pytest-cov
    ```

## Running Tests

1. **Run All Tests**:
   - From the `backend` directory, run all the test files at once:
     ```bash
     pytest 
     ```

2. **Run a Specific Test File**:
   - To run a specific test file, specify the path to the test file:
     ```bash
     pytest api/api_unit_test/<test_file_name>_test.py
     ```

## Generating Coverage Report

1. **Run Coverage**:
   - To generate a coverage report, use the following command:
     ```bash
     coverage run --source=api manage.py test api/api_unit_test
     ```

2. **Generate HTML Report**:
   - To generate a more detailed HTML coverage report, use the following command:
     ```bash
     coverage report
     coverage html
     ```
   - This will create an `htmlcov` directory. Open the `index.html` file within this directory in a web browser to view the coverage report.

