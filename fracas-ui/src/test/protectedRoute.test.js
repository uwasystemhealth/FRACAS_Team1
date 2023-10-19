import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../components/useAuth';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';



// Mock useAuth and useNavigate hooks
jest.mock('../components/useAuth');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('<ProtectedRoute />', () => {

  const DummyComponent = () => <div>Protected Content</div>;
  let navigateMock;

  beforeEach(() => {
    // Reset mocks before each test
    useAuth.mockReset();
    useNavigate.mockReset();

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  test('renders protected content if authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    render(<DummyComponent />);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  test('redirects to login if not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    render(<ProtectedRoute element={<DummyComponent />} />);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
