# FRACAS Frontend Jest Unit Testing documentation

## Overview

Jest is a JavaScript testing framework that helps you write and run unit tests for your frontend applications. This README will guide you through setting up and using Jest effectively.

## Important Files and Directories

- `src/test/`: Store unit test files, corresponding to the Pages file and the files in the components folder, with the same filename.
  - `*.test.js`: Unit Test Code.
- `jest.config.js`: Unit Test Configuration
- `package.json`: Unit Test Configuration

## Installation

To install your project, you can use npm or yarn. Run the following command:

```bash
npm install
# or
yarn
```

### Dependencies

- jest-fetch-mock: Simulate fetch request, intercept fetch request
- @testing-library/user-event: Simulate user events such as clicks, inputs

## Configuration

Jest can be configured to suit your project's needs. You can set options for test file patterns, reporters, plugins, and more. Configure Jest by creating a `jest.config.js` file or by adding a `"jest"` section in your `package.json`.

```javascript
// jest.config.js
module.exports = {
  // The axios request library is used in the project and requires this configuration
  transformIgnorePatterns: ["node_modules/(?!axios)"] 
};
```

## Writing Tests

Here are some test case examples:

```javascript
// 1. Determines if a document element is rendering properly
test('renders "What We Do" heading', () => {
    render(<HomePage />); // render page
    const headingElement = screen.getByText('What We Do'); // Get dom element
    expect(headingElement).toBeInTheDocument(); // Determining if 'What We Do' is on the page
  });


// 2. Description of the Signup file used
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // router
import "@testing-library/jest-dom/extend-expect"; // Extension of dom operations
import Signup from "../pages/Signup"; // A module that needs to be tested
import userEvent from "@testing-library/user-event"; // Simulate user events
import fetchMock from "jest-fetch-mock"; // Simulate fetch
import { useNavigate } from "react-router-dom";

const typeInput = () => {
  const firstName = screen.getByPlaceholderText('Please enter your First Name'); // Grabbing elements on the screen
  const lastName = screen.getByPlaceholderText('Please enter your Last Name'); // Grabbing elements on the screen
  const team = screen.getByPlaceholderText('Please enter your Team');
  const email = screen.getByPlaceholderText('Please enter your Email');
  const password = screen.getByPlaceholderText('Please enter your Password');
  const confirm_password = screen.getByPlaceholderText('Please re-enter your Password');
  userEvent.type(firstName, 'testuser'); // Simulate the user to type in the input box
  userEvent.type(lastName, 'testuser'); // Simulate the user to type in the input box
  userEvent.type(team, 'testuser');
  userEvent.type(email, 'testuser');
  userEvent.type(password, 'testuser');
  userEvent.type(confirm_password, 'testuser');
}
// mock request
const fetchData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "x",
        last_name: "x",
        email: "x",
        team: "x",
        password1: "xx",
        password2: "xx",
      }),
    });
    if (response.status === 201) {
      return response; // Request successful
    } else {
      return response; // Request failed
    }
  } catch (error) {}  // Request error
};

fetchMock.enableMocks(); // Enable fetch request interception

 // Intercept window.alert
const originalAlert = window.alert;
window.alert = jest.fn();
 // Intercept console.error
const consoleErrors = [];
const originalConsoleError = console.error;
console.error = (message) => {
  consoleErrors.push(message);
};
// Simulate route and navigate
jest.mock("react-router-dom", () => ({     
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("<Signup />", () => {
  let navigateMock;

  // Reset route to initial state
  beforeEach(() => {
    useNavigate.mockReset();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });
  // Reset "window.alert" and "console.error" to initial state
  afterAll(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError;
  });
  // Determines if a document element is rendering properly
  it("renders the view", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });
  // Simulate a registration page where the user input their account and password, clicks login, and requests the interface
  test("register", async () => {
    render(
      <MemoryRouter> // Simulate a registration page
        <Signup />
      </MemoryRouter>
    );
    typeInput(); // simulate user events

    const json = jest.fn();
    json.mockResolvedValue({ status: 201 });
    fetchMock.mockResolvedValue({ status: 201, json }); // mock response from backend api

    userEvent.click(screen.getByRole("button", { name: "Register" })); // click button

    const response = await fetchData();
    if (response.status === 201) {
    }
  });

  // Simulate Registration Failed
  test("register_failed", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    typeInput(); // simulate user events
    const json = jest.fn();
    json.mockResolvedValue({ status: 401, });
    fetchMock.mockResolvedValue({ status: 401, json });  // mock response from backend api
    userEvent.click(screen.getByRole("button", { name: "Register" }));  // click button
    await fetchData();
  });

  // Simulate backend interface exceptions
  test("register_catch", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    typeInput(); // simulate user events
    fetchMock.mockRejectedValue(new Error("Network error"));  // mock response from backend api

    userEvent.click(screen.getByRole("button", { name: "Register" }));  // click button

    await fetchData();
  });
});

```

## Running Tests

You can run your tests using the following command:

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Types of Test Coverage

There are several types of test coverage metrics you can focus on:
The final coverage is usually verified using Statement Coverage

1. **Statement Coverage (% Stmts)**: Measures the percentage of code statements executed by tests.

2. **Line Coverage (% Lines)**: Measures the percentage of code lines executed by your tests.

3. **Function Coverage (% Funcs)**: Measures the percentage of functions or methods that are invoked by your tests.

4. **Branch Coverage (% Funcs)**: Measures the percentage of decision branches in your code that are taken by tests (e.g., if-else conditions).

Example

File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|---------------------------------------------------
All files           |   46.07 |    26.69 |   34.58 |   48.08 |
 src                |    38.2 |    15.62 |      55 |   40.74 |
  App.js            |       0 |      100 |       0 |       0 | 20
  api.js            |   39.53 |    15.62 |   57.89 |    42.3 | ...62-73,85-91,98-103,108-121,126-139,144-158,167
  index.js          |       0 |      100 |     100 |       0 | 5-6
 src/components     |   63.36 |    58.82 |   53.12 |   63.63 |
  CommentsModal.js  |   58.97 |       20 |      50 |   59.45 | 38-56,73-88
  Footer.js         |     100 |      100 |     100 |     100 |
  Header.js         |   43.24 |       70 |   23.07 |   43.24 | 13,17-31,36,41,66-102
  ProtectedRoute.js |     100 |      100 |     100 |     100 |
  useAuth.js        |     100 |      100 |     100 |     100 |
 src/pages          |   44.08 |       23 |   29.25 |   46.18 |
  Activation.js     |       0 |        0 |       0 |       0 | 7-27
  AdminDashboard.js |      75 |      100 |     100 |      75 | 24-28
  ForgotPassword.js |       0 |        0 |       0 |       0 | 8-51
  HomePage.js       |     100 |      100 |     100 |     100 |
  Login.js          |      50 |        0 |     100 |      50 | 22-39
  Report.js         |   50.73 |    27.41 |   24.24 |   56.09 | ...72-176,191-192,205-206,217-218,225-227,257-456
  ResetPassword.js  |       0 |        0 |       0 |       0 | 7-85
  SearchReports.js  |   39.28 |    33.33 |   26.92 |    39.5 | ...55-56,71-81,85-100,107-116,121-130,135,157-273
  Signup.js         |      40 |    14.28 |   27.27 |      40 | 22-24,34-67,115-169
  UserDashboard.js  |      65 |        0 |     100 |      65 | 24-33
  ViewEdit.js       |   51.42 |    26.92 |   26.22 |   55.38 | ...67,192-205,211-212,224-225,232-234,263-457,468
--------------------|---------|----------|---------|---------|-----

Test Suites: 6 failed, 6 passed, 12 total
Tests:       11 failed, 31 passed, 42 total

- failed:: Indicates that the test case did not pass, you can check the console output report to solve the problem
- passed::  Indicates that the test passed.
- Uncovered Line:: Code not covered by test cases can be resolved by adding test cases

### Best Practices

1. Regularly check and improve test coverage as your codebase evolves.
