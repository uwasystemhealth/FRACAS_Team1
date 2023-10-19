import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import SearchReports from "../pages/SearchReports";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/useAuth";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axiosInstance = axios.create();
const mock = new MockAdapter(axiosInstance);
const token = 'a5d51f069c304b02b7ba14d391a39048c36f113a'

mock.onGet('http://127.0.0.1:8000/api/records/').reply(200, { results: [{ failure_title: "xxx2", record_id: 1 }] });
mock.onGet('http://127.0.0.1:8000/api/teams/').reply(200, {results: [] });
mock.onGet('http://127.0.0.1:8000/api/cars/').reply(200, { results: [] });
mock.onGet('http://127.0.0.1:8000/api/subsystems/').reply(200, { results: [] });

const fetchData = async () => {
  try {
    const response = await axiosInstance.get(`http://127.0.0.1:8000/api/records/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchData2 = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/teams/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {}
};

const fetchData3 = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/subsystems/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  } catch (error) {}
};

const fetchData4 = async () => {
  try {
    const response = await axiosInstance.get("http://127.0.0.1:8000/api/cars/", {
      headers: {
        Authorization: `Token ${token}`,
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

describe("<SearchReports />", () => {
  let navigateMock;

  beforeEach(() => {
    useAuth.mockReset();
    useNavigate.mockReset();
    localStorage.setItem('token', token)

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterAll(() => {
    window.alert = originalAlert;
    console.error = originalConsoleError;
  });

  test("renders the view", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <SearchReports />
      </MemoryRouter>
    );
    await fetchData2();
    await fetchData3();
    await fetchData4();
    await fetchData();
    await act(async () => {
      expect(screen.getByText("Search")).toBeInTheDocument();
    });
  });

  test("click_search_button", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <SearchReports />
      </MemoryRouter>
    );

    await fetchData2();
    await fetchData3();
    await fetchData4();
    userEvent.click(screen.getByRole("button", { name: "Search" }));

    const response = await fetchData();
    if (response.status === 200) {
      await act(async () => {
      });
    }
  });
});
