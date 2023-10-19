import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Signup from "../pages/Signup";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import { useNavigate } from "react-router-dom";

const typeInput = () => {
  const firstName = screen.getByPlaceholderText('Please enter your First Name');
  const lastName = screen.getByPlaceholderText('Please enter your Last Name');
  const team = screen.getByPlaceholderText('Please enter your Team');
  const email = screen.getByPlaceholderText('Please enter your Email');
  const password = screen.getByPlaceholderText('Please enter your Password');
  const confirm_password = screen.getByPlaceholderText('Please re-enter your Password');
  userEvent.type(firstName, 'testuser');
  userEvent.type(lastName, 'testuser');
  userEvent.type(team, 'testuser');
  userEvent.type(email, 'testuser');
  userEvent.type(password, 'testuser');
  userEvent.type(confirm_password, 'testuser');
}

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
      return response;
    } else {
      return response;
    }
  } catch (error) {}
};

fetchMock.enableMocks();

const originalAlert = window.alert;
window.alert = jest.fn();

const consoleErrors = [];
const originalConsoleError = console.error;
console.error = (message) => {
  consoleErrors.push(message);
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("<Signup />", () => {
  let navigateMock;

  beforeEach(() => {
    useNavigate.mockReset();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterAll(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError;
  });

  it("renders the view", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome!")).toBeInTheDocument();
  });

  test("login", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    typeInput();

    const json = jest.fn();
    json.mockResolvedValue({ status: 201 });
    fetchMock.mockResolvedValue({ status: 201, json });

    userEvent.click(screen.getByRole("button", { name: "Register" }));

    const response = await fetchData();
    if (response.status === 201) {
    }
  });


  test("login_failed", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    typeInput();
    const json = jest.fn();
    json.mockResolvedValue({ status: 401, });
    fetchMock.mockResolvedValue({ status: 401, json });
    userEvent.click(screen.getByRole("button", { name: "Register" }));
    await fetchData();
  });

  test("login_catch", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    typeInput();
    fetchMock.mockRejectedValue(new Error("Network error"));

    userEvent.click(screen.getByRole("button", { name: "Register" }));

    await fetchData();
  });
});
