import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from '../components/Header';

// Mocking modules and globals
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn();

beforeEach(() => {
  // Clear all items from localStorage
  localStorage.clear();
});

describe('<Header />', () => {
  
    const renderWithRouter = (ui, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);
        return render(<Router>{ui}</Router>);
    };
    
  
  it('renders without crashing', () => {
    renderWithRouter(<Header />);
    expect(screen.getByAltText('UWAM Logo')).toBeInTheDocument();
  });

  it('renders the correct navigation links when not authenticated', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders the user dashboard and logout links when authenticated', () => {
    localStorage.setItem('token', 'some_token');
    renderWithRouter(<Header />);
    expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders the admin dashboard link for admin users', () => {
    localStorage.setItem('token', 'some_token');
    localStorage.setItem('is_admin', 'true');
    renderWithRouter(<Header />);
    expect(screen.getByText('Admin Dashboard (External)')).toBeInTheDocument();
  });

});
