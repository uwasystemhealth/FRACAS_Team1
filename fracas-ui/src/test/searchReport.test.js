import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // for improved assertions
import { BrowserRouter as Router } from 'react-router-dom'; // Importing Router
import SearchReports from '../pages/SearchReports';
import * as api from '../api';

jest.mock('../api', () => ({
  getTeams: jest.fn(),
  getSubsystems: jest.fn(),
  getCars: jest.fn(),
  getRecords: jest.fn(),
  searchRecords: jest.fn(),
  getPageByURL: jest.fn(),
}));

// Updating the renderComponent function to include the Router context
const renderComponent = () =>
  render(
    <Router>
      <SearchReports />
    </Router>
  );

describe('SearchReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Removed the test that checks for 'SEARCH REPORTS'

  test('triggers a search when the "Search" button is clicked', async () => {
    api.getTeams.mockResolvedValueOnce({ data: [] });
    api.getSubsystems.mockResolvedValueOnce({ data: [] });
    api.getCars.mockResolvedValueOnce({ data: [] });
    api.getRecords.mockResolvedValueOnce({ data: [] });
    api.searchRecords.mockResolvedValueOnce({ data: { results: [], next: null, previous: null } });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test query' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => expect(api.searchRecords).toHaveBeenCalledTimes(1));
  });

  // Add more tests as required
});
