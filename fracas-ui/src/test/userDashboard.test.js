import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Import jest-dom for custom matchers
import UserDashboard from "../pages/UserDashboard"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/useAuth";
import userEvent from "@testing-library/user-event";
import ProtectedRoute from "../components/ProtectedRoute";
import fetchMock from 'jest-fetch-mock';

const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetchMock("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 200) {
      return response
    } else {
      return response
    }
  } catch (error) {

  }
};

fetchMock.enableMocks();

const originalAlert = window.alert;
window.alert = jest.fn();

const consoleErrors = [];
const originalConsoleError = console.error
console.error = (message) => {
  consoleErrors.push(message)
}

jest.mock("../components/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Test Application runs and page visually", () => {
  let navigateMock;

  beforeEach(() => {
    useAuth.mockReset();
    useNavigate.mockReset();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterAll(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError
  });

  test("view", () => {
    render(<UserDashboard />);
    expect(screen.getByText("Manage Your Reports")).toBeInTheDocument();
  });

  test("submit", () => {
    render(<UserDashboard />);
    fireEvent(
      screen.getByText(/Submit Report/i),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
  });
  test("search", () => {
    render(<UserDashboard />);
    fireEvent(
      screen.getByText(/Search Reports/i),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
  });

  test("logoutSuccess", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      signout: () => {
        localStorage.removeItem("is_admin");
        localStorage.removeItem("token");
      },
    });
    render(<ProtectedRoute element={<UserDashboard />} />);
    const json = jest.fn();
    json.mockResolvedValue({ status: 200 })
    fetchMock.mockResolvedValue({ status: 200, json })
    
    userEvent.click(screen.getByText("Log out"));
    const response = await fetchData();
    if (response.status === 200) {
      await act(async () => {
        expect(navigateMock).toHaveBeenCalledWith('/');
      });
    }
  });
  test("logoutFailed", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      signout: () => {
        localStorage.removeItem("is_admin");
        localStorage.removeItem("token");
      },
    });
    render(<ProtectedRoute element={<UserDashboard />} />);
    const json = jest.fn();
    json.mockResolvedValue({ status: 401 })
    fetchMock.mockResolvedValue({ status: 401, json })
    userEvent.click(screen.getByText("Log out"));
    await fetchData();
    await act(async () => {
      // expect(window.alert).toHaveBeenCalled();
    });
  });

  test("logout_try_catch", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      signout: () => {
        localStorage.removeItem("is_admin");
        localStorage.removeItem("token");
      },
    });
    render(<ProtectedRoute element={<UserDashboard />} />);
    fetchMock.mockRejectedValue(new Error('Network error'))
    userEvent.click(screen.getByText("Log out"));
    await fetchData();
    await act(async () => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});

