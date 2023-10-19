import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Login from "../pages/Login";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import { useAuth } from "../components/useAuth";
import { useNavigate } from "react-router-dom";

const typeInput = () => {
  const email = screen.getByPlaceholderText('Please enter your email');
  const password = screen.getByPlaceholderText('Please enter your Password');
  userEvent.type(email, 'testuser');
  userEvent.type(password, 'testuser');
}

const fetchData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "kk@gmail.com",
        password: "123123",
      }),
    });
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {}
};

const fetchData2 = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "GET",
      headers: {
        Authorization: `Token xxxx`,
      },
    });
    if (response.status === 200) {
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

jest.mock("../components/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("<Login />", () => {
  let navigateMock;

  beforeEach(() => {
    useAuth.mockReset();
    useNavigate.mockReset();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterAll(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError;
  });

  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verify that form elements are present
    expect(screen.getByRole("heading", { name: "Log in" })).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Create account")).toBeInTheDocument();
  });

  test("handles login form submission", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
  });

  test("login", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      authenticate: () => {}
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    typeInput();
    const json = jest.fn();
    json.mockResolvedValue({ status: 200, token: "xxxxx" });
    fetchMock.mockResolvedValue({ status: 200, json });

    userEvent.click(screen.getByRole("button", { name: "Log in" }));

    const response = await fetchData();
    if (response.status === 200) {
      json.mockResolvedValue({ status: 200 });
      fetchMock.mockResolvedValue({ status: 200, json });
      await fetchData2();
    }
  });

  test("login_failed", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      authenticate: () => {}
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    typeInput();
    const json = jest.fn();
    json.mockResolvedValue({ status: 401, token: "xxxxx" });
    fetchMock.mockResolvedValue({ status: 401, json });

    userEvent.click(screen.getByRole("button", { name: "Log in" }));

    const response = await fetchData();
  });

  test("login_catch", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      authenticate: () => {}
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    typeInput();
    fetchMock.mockRejectedValue(new Error('Network error'))

    userEvent.click(screen.getByRole("button", { name: "Log in" }));

    await fetchData();
  });
});
